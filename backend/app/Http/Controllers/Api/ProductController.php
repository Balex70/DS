<?php

namespace App\Http\Controllers\Api;

use App\Enums\ProductAiStatusEnum;
use App\Enums\ProductVariantAiStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\ProductVariant;
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
        $query->with('translations');

        // // SEARCH
        // if ($request->filled('search')) {
        //     $query->where('name_raw', 'like', "%{$request->search}%");
        // }

        if ($request->filled('categoryIds')) {
            $categoryIds = explode(',', $request->categoryIds);

            $query->whereHas('categories', function ($q) use ($categoryIds) {
                $q->whereIn('categories.id', $categoryIds);
            });
        }

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
        $data = $request->validated();

        DB::transaction(function () use ($product, $data) {

            // 1. Update base product fields | en
            $product->update([
                'price' => $data['price'],
                'name_processed' => $data['translations']['en']['name'],
                'description_processed' => $data['translations']['en']['description'],
            ]);

            // 2. Sync translations
            if (!empty($data['translations'])) {
                foreach ($data['translations'] as $locale => $translation) {
                    if ($locale === 'en') {
                        continue;
                    }
                    $product->translations()->updateOrCreate(
                        [
                            'locale' => $locale,
                        ],
                        [
                            'name' => $translation['name'],
                            'description' => $translation['description'] ?? null,
                        ]
                    );
                }
            }
        });

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
            $nextProduct = Product::where('ai_status', ProductAiStatusEnum::QUEUED)
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

    public function aiVariantTextsNext()
    {
        $productVariantToProcess = DB::transaction(function () {
            $nextProductVariant = ProductVariant::where('ai_status', ProductVariantAiStatusEnum::QUEUED)
                ->orderBy('id')
                ->lockForUpdate()
                ->first();

            if (!$nextProductVariant) {
                return null;
            }

            $nextProductVariant->update([
                'ai_status' => ProductVariantAiStatusEnum::PROCESSING
            ]);

            return $nextProductVariant;
        });

        if (!$productVariantToProcess) {
            return response()->json(null, 204);
        }

        return response()->json([
            'id' => $productVariantToProcess->id,
            'product_id' => $productVariantToProcess->product_id,
            'variant_name' => $productVariantToProcess->name,
        ]);
    }

    public function aiTextsTranslateNext(string $locale)
    {
        $productToProcess = DB::transaction(function () use ($locale) {
            $query = Product::where('ai_status', ProductAiStatusEnum::DONE)
                ->whereDoesntHave('translations', function ($q) use ($locale) {
                    $q->where('locale', $locale);
                });

            $product = $query
                ->with('translations')
                ->orderBy('id')
                ->lockForUpdate()
                ->first();

            return $product;
        });

        if (!$productToProcess) {
            return response()->json(null, 204);
        }

        return response()->json([
            'id' => $productToProcess->id,
            'product_name' => $productToProcess->name_processed,
            'description' => $productToProcess->description_processed
        ]);
    }

    public function aiVariantTextsTranslateNext(string $locale)
    {
        $productVariantToProcess = DB::transaction(function () use ($locale) {
            $query = ProductVariant::where('ai_status', ProductVariantAiStatusEnum::DONE)
                ->whereDoesntHave('translations', function ($q) use ($locale) {
                    $q->where('locale', $locale);
                });

            $product = $query
                ->with('translations')
                ->orderBy('id')
                ->lockForUpdate()
                ->first();

            return $product;
        });

        if (!$productVariantToProcess) {
            return response()->json(null, 204);
        }

        return response()->json([
            'id' => $productVariantToProcess->id,
            'product_id' => $productVariantToProcess->product_id,
            'variant_name' => $productVariantToProcess->name
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

    public function aiVariantTextsComplete(ProductVariant $productVariant, Request $request)
    {
        $productVariant->update([
            'name_processed' => $request->title,
            'ai_status' => ProductVariantAiStatusEnum::DONE
        ]);

        return response()->json(['ok' => true]);
    }

    public function aiTextsTranslateComplete(Product $product, Request $request)
    {
        $data = $request->all();

        // 2. Sync translations
        if (isset($data['locale'])) {
            $product->translations()->updateOrCreate(
                [
                    'locale' => $data['locale'],
                ],
                [
                    'name' => $data['title'] ?? null,
                    'description' => $data['description'] ?? null,
                    'translated_at' => now(),
                ]
            );
        }

        return response()->json(['ok' => true]);
    }
}
