<?php

namespace App\Http\Controllers\Api\Store;

use App\Currency\Services\PriceConverter;
use App\Enums\CurrenciesEnum;
use App\Enums\LocalesEnum;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(
        private ProductService $service,
        private PriceConverter $converter
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
        abort_unless(
            $product->last_enrichment_at !== null
                && $product->ai_texts_at !== null
                && $product->enrichment_failed_at === null,
            404
        );

        $locale = $request->locale ?? 'en';
        $product->load([
            'variants' => fn ($query) => $query
                ->with('image', 'translations')
                ->orderBy('id'),
            'translations',
            'materials.translation' => fn ($q) => $q->where('locale', $locale),
        ]);

        if ($request->filled('currency')) {
            $product->currency_price = $this->converter->convert(
                $product->price,
                CurrenciesEnum::USD->value,
                $request->currency,
            );
            $product->variants->each(function ($variant) use ($request) {
                $variant->currency_price = $this->converter->convert(
                    $variant->price,
                    CurrenciesEnum::USD->value,
                    $request->currency,
                );
            });
        }

        return new ProductResource($product);
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
        $query = Product::query();
        $query->whereNotNull('last_enrichment_at');
        $query->whereNotNull('ai_texts_at');
        $query->whereNull('enrichment_failed_at');
        $query->whereHas('categories', function ($q) {
            $q->where('is_visible', true);
        });
        $query->with('cheapestVariant');

        if ($request->filled('locale') && LocalesEnum::tryFrom($request->locale)) {
            $locale = $request->locale ?? 'en';

            $query->with([
                'translation' => fn ($q) => $q->where('locale', $locale),
            ]);
        }

        $query->latest();
        $latestProducts = $query->limit(5)->get();

        if ($request->filled('currency')) {
            $latestProducts->each(function (Product $product) use ($request) {
                $product->currency_price = $this->converter->convert(
                    $product->price,
                    CurrenciesEnum::USD->value,
                    $request->currency,
                );
            });
        }

        return ProductResource::collection(
            $latestProducts
        );
    }
}
