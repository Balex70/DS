<?php

namespace App\Http\Controllers\Api\Store;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(
        private ProductService $service
    ) {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = $request->only([
            'category',
            'locale',
            'sort',
            'price',
            'activeMaterials',
            'currency',
        ]);

        return ProductResource::collection(
            $this->service->getCategoryProducts($filters)
        );
    }

    public function show(Request $request, Product $product)
    {
        return new ProductResource(
            $this->service->getProductDetails(
                $product,
                $request->only(['locale', 'currency'])
            )
        );
    }

    public function filters(Request $request)
    {
        $filters = $request->only([
            'category',
            'locale',
        ]);

        return response()->json($this->service->getFilters($filters));
    }

    public function latest(Request $request)
    {
        return ProductResource::collection(
            $this->service->getLatestProducts(
                $request->only(['locale', 'currency']),
                5
            )
        );
    }
}
