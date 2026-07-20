<?php

namespace App\Http\Controllers\Api\Store;

use App\Http\Controllers\Controller;
use App\Http\Resources\StoreCategoryResource;
use App\Models\Category;
use App\Models\Product;
use App\Services\CategoryService;

class CategoryController extends Controller
{
    public function __construct(
        protected CategoryService $categoryService
    )
    {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Category::orderBy('id');
        $query->where('active', true);
        $query->with('translations');
        return StoreCategoryResource::collection($query->get());
    }

    /**
     * Display a listing for category section in home page
     */
    public function categorySection()
    {
        $categories = Category::query()
            ->where('active', true)
            ->whereNull('parent_id')
            ->with('translations')
            ->get();

        $categories->each(function ($category) {
            $slugs = $this->categoryService->getChildrenSlugs($category->slug);

            $products = Product::query()
                ->whereNotNull('last_enrichment_at')
                ->where('ai_status', 'done')
                ->whereHas('categories', function ($q) use ($slugs) {
                    $q->whereIn('slug', $slugs);
                })
                ->with([
                    'cheapestVariant',
                    'bigImage',
                ])
                ->latest()
                ->limit(8)
                ->get();

            $category->setRelation('products', $products);
        });

        return StoreCategoryResource::collection($categories);
    }
}
