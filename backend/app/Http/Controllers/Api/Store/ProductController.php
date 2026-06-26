<?php

namespace App\Http\Controllers\Api\Store;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Material;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(
        private ProductService $service,
    ) {}
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = $this->service->baseCategoryQuery($request);
        $query->with('cheapestVariant');

        match ($request->sort ?? 'latest') {
            'latest' => $query->latest(),
            'price_asc' => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            default => $query->latest(),
        };

        if($request->filled('price') && count($request->price) === 2) {
            $query->whereBetween('price', [
                $request->price[0],
                $request->price[1],
            ]);

            // TODO: can use variants but not sure if necessary for now (and it slower and requires show price range in products list)
            // $query->whereHas('variants', function ($q) use ($request) {
            //     $q->whereBetween('price', [
            //         $request->price[0],
            //         $request->price[1],
            //     ]);
            // });
        }

        if($request->filled('activeMaterials')) {
            $query->whereHas('materials', function ($q) use ($request) {
                $q->whereIn('materials.name', $request->activeMaterials);
            });
        }

        return ProductResource::collection(
            $query->paginate(24)
        );
    }

    public function show(Product $product)
    {
        $product->load([
            'variants' => fn ($query) => $query
                ->with('image')
                ->orderBy('price'),
        ]);
        return new ProductResource($product);
    }

    public function filters(Request $request)
    {
        $base = $this->service->baseCategoryQuery($request);
        $baseWithVariants = $base->join('product_variants', 'products.id', '=', 'product_variants.product_id');

        // PRICE RANGE (clone to avoid query mutation)
        $price = (clone $baseWithVariants)
            ->selectRaw('MIN(products.price) as min, MAX(products.price) as max')
            ->first();

        // MATERIALS (clone to avoid query mutation)
        $productIds = (clone $base)
            ->select('products.id')
            ->distinct()
            ->pluck('id');
        $materials = Material::query()
            ->whereHas('products', function ($q) use ($productIds) {
                $q->whereIn('products.id', $productIds);
            })
            ->pluck('name');

        // WEIGHT RANGE
        // $weight = $base
        //     ->join('product_variants', 'products.id', '=', 'product_variants.product_id')
        //     ->selectRaw('MIN(product_variants.weight) as min, MAX(product_variants.weight) as max')
        //     ->first();

        return response()->json([
            'price' => $price,
            'materials' => $materials,
            'weight' => [],
        ]);
    }
}
