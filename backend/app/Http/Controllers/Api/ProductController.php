<?php

namespace App\Http\Controllers\Api;

use App\Enums\ProductAiStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class ProductController extends Controller
{
    public function __construct(private ProductService $service) {}
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Product::class);

        $query = Product::query()->orderBy('id');

        // // SEARCH
        // if ($request->filled('search')) {
        //     $query->where('name_raw', 'like', "%{$request->search}%");
        // }

        // ENRICHED FILTER
        if ($request->filled('enriched')) {
            $query->orWhereNotNull('last_enrichment_at');
        }

        // AI TEXTS FILTER
        if ($request->filled('aiTextsProcessed')) {
            $query->orWhereNotNull('ai_texts_at');
        }

        // AI IMAGES FILTER
        if ($request->filled('aiImagesProcessed')) {
            $query->orWhereNotNull('ai_images_at');
        }

        return ProductResource::collection(
            $query->paginate(10)
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        Gate::authorize('update', $product);
        
        $product->update($request->validated());

        return new ProductResource($product);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        Gate::authorize('delete', $product);

        $product->delete();

        return response()->noContent();
    }

    public function enrich(Product $product)
    {
        Gate::authorize('enrich', $product);

        $this->service->enrichProduct($product);

        return response()->json(['message' => 'Product enriched'], 200);
    }

    public function aiTextsNext()
    {
        $productToProcess = DB::transaction(function () {
            $nextProduct = Product::where('ai_status', 'queued')
                ->whereNotNull('last_enrichment_at')
                ->orderBy('id')
                ->lockForUpdate()
                ->first();

            if (!$nextProduct) {
                return null;
            }

            $nextProduct->update([
                'ai_status' => ProductAiStatusEnum::PROCESSING
            ]);

            return $nextProduct;
        });

        if (!$productToProcess) {
            return response()->json(null, 204);
        }

        return response()->json([
            'id' => $productToProcess->id,
            'product_name' => $productToProcess->name_raw,
            'description' => $productToProcess->description_raw
        ]);
    }

    public function aiTextsComplete(Product $product, Request $request)
    {
        $product->update([
            'name_processed' => $request->title,
            'description_processed' => $request->description,
            'ai_texts_at' => now(),
            'ai_status' => ProductAiStatusEnum::DONE
        ]);

        return response()->json(['ok' => true]);
    }
}
