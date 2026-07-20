<?php

namespace App\Http\Controllers\Api\Store;

use App\Currency\Services\PriceConverter;
use App\Enums\CurrenciesEnum;
use App\Enums\LocalesEnum;
use App\Http\Controllers\Controller;
use App\Http\Resources\StoreCategoryResource;
use App\Models\Category;
use App\Models\Product;
use App\Services\CategoryService;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function __construct(
        protected CategoryService $categoryService,
        private PriceConverter $converter
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
    public function categorySection(Request $request)
    {
        $categories = Category::query()
            ->where('active', true)
            ->whereNull('parent_id')
            ->with('translations')
            ->get();

        $categories->each(function ($category) use ($request) {
            $slugs = $this->categoryService->getChildrenSlugs($category->slug);

            $productsQuery = Product::query()
                ->whereNotNull('last_enrichment_at')
                ->where('ai_status', 'done')
                ->whereHas('categories', function ($q) use ($slugs) {
                    $q->whereIn('slug', $slugs);
                })
                ->whereHas('categories', function ($q) {
                    $q->where('is_visible', true);
                })
                ->with([
                    'cheapestVariant',
                    'bigImage',
                ]);

            if($request->filled('locale') && LocalesEnum::tryFrom($request->locale)) {
                $locale = $request->locale ?? 'en';

                $productsQuery->with([
                    'translation' => fn ($q) => $q->where('locale', $locale),
                ]);
            }

            $products = $productsQuery->latest()
                ->limit(8)
                ->get();

            if($request->filled('currency')) {
                $products->each(function (Product $product) use ($request) {
                    $product->currency_price = $this->converter->convert(
                        $product->price,
                        CurrenciesEnum::USD->value,
                        $request->currency,
                    );
                });
            }

            $category->setRelation('products', $products);
        });

        return StoreCategoryResource::collection($categories);
    }
}
