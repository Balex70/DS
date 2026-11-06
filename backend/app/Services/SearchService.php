<?php

namespace App\Services;

use App\Currency\Services\PriceConverter;
use App\Enums\CurrenciesEnum;
use App\Models\Category;
use App\Models\Material;
use App\Models\Product;
use App\SearchEngine\SearchEngineManager;
use Illuminate\Support\Facades\DB;

class SearchService
{
    public function __construct(
        private PriceConverter $converter,
        private SearchEngineManager $searchEngineManager,
    ) {
    }

    public function searchQuery(string $search, string $locale, string $currency): array
    {
        $query = Product::query();
        $query->whereNotNull('last_enrichment_at');
        $query->whereNotNull('ai_texts_at');
        $query->whereNull('enrichment_failed_at');
        $query->whereHas('categories', function ($q) {
            $q->where('is_visible', true);
        });
        $query->select([
            'products.id',
            'products.name_raw',
            'products.name_processed',
            'products.price',
            'products.slug',
        ]);

        if ($locale) {
            $query
            ->with([
                'variants',
                'translation' => fn ($q) => $q->where('locale', $locale),
                'variants.translation' => fn ($q) => $q->where('locale', $locale),
            ])
            ->where(function ($q) use ($search, $locale) {
                $q->where('products.name_processed', 'ILIKE', "%{$search}%")
                ->orWhere('products.name_raw', 'ILIKE', "%{$search}%")
                ->orWhereHas('translations', function ($tq) use ($search, $locale) {
                    $tq->where('locale', $locale)
                        ->where('name', 'ILIKE', "%{$search}%");
                })
                ->orWhereHas('variants', function ($vq) use ($search, $locale) {
                    $vq->where('product_variants.name', 'ILIKE', "%{$search}%")
                        ->orWhere('product_variants.name_processed', 'ILIKE', "%{$search}%")
                        ->orWhereHas('translations', function ($vtq) use ($search, $locale) {
                            $vtq->where('locale', $locale)
                                ->where('name', 'ILIKE', "%{$search}%");
                        });
                });
            });
        } else {
            $query
                ->with(['variants'])
                ->where(function ($q) use ($search) {
                    $q->where('products.name_processed', 'ILIKE', "%{$search}%")
                    ->orWhere('products.name_raw', 'ILIKE', "%{$search}%")
                    ->orWhereHas('variants', function ($vq) use ($search) {
                        $vq->where('product_variants.name', 'ILIKE', "%{$search}%")
                        ->orWhere('product_variants.name_processed', 'ILIKE', "%{$search}%");
                    });
                });
        }

        $products = $query->limit(10)->get();

        if ($currency) {
            $products->each(function (Product $product) use ($currency) {
                $product->currency_price = $this->converter->convert(
                    $product->price,
                    CurrenciesEnum::USD->value,
                    $currency,
                );
            });
        }

        $categories = Category::query()
            ->where('active', true)
            ->where('is_visible', true)
            ->select(['id', 'name', 'slug', 'full_path'])
            ->when(
                $locale,
                fn ($query) => $query->where(function ($q) use ($search, $locale) {
                    $q->where('name', 'ILIKE', "%{$search}%")
                        ->orWhereHas('translations', function ($tq) use ($search, $locale) {
                            $tq->where('locale', $locale)
                                ->where('name', 'ILIKE', "%{$search}%");
                        });
                }),
                fn ($query) => $query->where('name', 'ILIKE', "%{$search}%")
            )
            ->with([
                'translations' => fn ($q) => $locale
                    ? $q->where('locale', $locale)
                    : $q,
            ])
            ->limit(5)
            ->get();

        return [
            $products,
            $categories
        ];
    }

    public function fullSearchQuery(string $search, string $locale, string $sort, string $currency, array | null $priceRange, array | null $activeMaterials): array
    {
        $provider = $this->searchEngineManager->driver();

        $result = $provider->fullSearchProducts(
            search: $search,
            locale: $locale,
            filters: [
                'price' => $priceRange,
                'materials' => $activeMaterials,
            ],
        );
        // \Log::info('fullSearchQuery result');
        // \Log::info($result);

        // if ($priceRange && count($priceRange) === 2) {
        //     $query->whereBetween('price', [
        //         $priceRange[0],
        //         $priceRange[1],
        //     ]);
        // }

        // if ($activeMaterials && count($activeMaterials) > 0) {
        //     $materialIds = $activeMaterials;

        //     $materialNames = Material::query()
        //         ->whereIn('id', $materialIds)
        //         ->selectRaw('LOWER(TRIM(name)) as normalized_name')
        //         ->distinct()
        //         ->pluck('normalized_name');

        //     $matchingMaterialIds = Material::query()
        //         ->whereIn(
        //             DB::raw('LOWER(TRIM(name))'),
        //             $materialNames
        //         )
        //         ->pluck('id');

        //     $query->whereHas('materials', function ($q) use ($matchingMaterialIds) {
        //         $q->whereIn('materials.id', $matchingMaterialIds);
        //     });
        // }

        // match ($sort ?? 'latest') {
        //     'latest' => $query->latest(),
        //     'price_asc' => $query->orderBy('price'),
        //     'price_desc' => $query->orderByDesc('price'),
        //     default => $query->latest(),
        // };

        if ($currency) {
            $result['products']['data'] = array_map(
                function (array $product) use ($currency) {
                    $product['currency_price'] = $this->converter->convert(
                        $product['price'],
                        CurrenciesEnum::USD->value,
                        $currency,
                    );

                    return $product;
                },
                $result['products']['data']
            );
        }

        $categories = Category::query()
            ->where('active', true)
            ->where('is_visible', true)
            ->select(['id', 'name', 'slug', 'full_path'])
            ->when(
                $locale,
                fn ($query) => $query->where(function ($q) use ($search, $locale) {
                    $q->where('name', 'ILIKE', "%{$search}%")
                        ->orWhereHas('translations', function ($tq) use ($search, $locale) {
                            $tq->where('locale', $locale)
                                ->where('name', 'ILIKE', "%{$search}%");
                        });
                }),
                fn ($query) => $query->where('name', 'ILIKE', "%{$search}%")
            )
            ->with([
                'translations' => fn ($q) => $locale
                    ? $q->where('locale', $locale)
                    : $q,
            ])
            ->limit(10)
            ->get();

        return [
            $result['products'],
            $result['filters'],
            $categories
        ];
    }

    public function filterQuery(string | null $search, string | null $locale = null)
    {
        // $provider = $this->searchEngineManager->driver();

        // $result = $provider->fullSearchProducts(search: $search, locale: $locale);
        // \Log::info('baseQuery result');
        // \Log::info($result);

        // return $query;
    }
}
