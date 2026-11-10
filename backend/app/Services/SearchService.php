<?php

namespace App\Services;

use App\Currency\Services\PriceConverter;
use App\Enums\CurrenciesEnum;
use App\Models\Category;
use App\SearchEngine\SearchEngineManager;

class SearchService
{
    public function __construct(
        private PriceConverter $converter,
        private SearchEngineManager $searchEngineManager,
    ) {
    }

    public function searchQuery(string $search, string $locale, string $currency): array
    {
        $provider = $this->searchEngineManager->driver();

        $categoryIds = Category::query()
            ->where('active', true)
            ->where('is_visible', true)
            ->pluck('id')
            ->all();

        $filters = [
            'category_ids' => $categoryIds,
        ];

        $products = $provider->searchProducts(
            search: $search,
            locale: $locale,
            filters: $filters,
            limit: 10
        );

        if ($currency) {
            $products = array_map(
                function (array $product) use ($currency) {
                    $product['currency_price'] = $this->converter->convert(
                        $product['price'],
                        CurrenciesEnum::USD->value,
                        $currency,
                    );

                    return $product;
                },
                $products
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
            ->limit(5)
            ->get();

        return [
            $products,
            $categories
        ];
    }

    public function fullSearchQuery(
        string $search,
        string $locale,
        string $sort,
        string $currency,
        ?array $priceRange,
        ?array $activeMaterials,
        int $page = 1,
        int $perPage = 10,
    ): array {
        $provider = $this->searchEngineManager->driver();

        $categoryIds = Category::query()
            ->where('active', true)
            ->where('is_visible', true)
            ->pluck('id')
            ->all();

        $filters = [
            'materials' => $activeMaterials,
            'category_ids' => $categoryIds,
        ];

        if ($priceRange && count($priceRange) === 2) {
            $filters['min_price'] = $priceRange[0];
            $filters['max_price'] = $priceRange[1];
        }

        $result = $provider->fullSearchProducts(
            search: $search,
            locale: $locale,
            sort: $sort,
            filters: $filters,
            page: $page,
            perPage: $perPage,
        );

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
}
