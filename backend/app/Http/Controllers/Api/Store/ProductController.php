<?php

namespace App\Http\Controllers\Api\Store;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use App\Services\CategoryService;
use App\Services\ProductService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(
        private ProductService $service,
        private CategoryService $categories
    ) {}
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Product::query();

        $slugArray = $request->category;
        $lastSlug = end($slugArray);
        $slugs = $this->categories->getChildrenSlugs($lastSlug);

        if ($request->filled('category')) {
            $query->whereHas('categories', function ($q) use ($slugs) {
                $q->whereIn('slug', $slugs);
            });
        }

        $query->has('bigImage'); // temporary, need to figure out  
        $query->latest();

        return ProductResource::collection(
            $query->paginate(24)
        );
    }
}
