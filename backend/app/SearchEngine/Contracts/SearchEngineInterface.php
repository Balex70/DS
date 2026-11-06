<?php

namespace App\SearchEngine\Contracts;

interface SearchEngineInterface
{
    public function getName(): string;

    public function indexProduct(array $product): void;

    /**
     * Search products.
     *
     * @param string $search
     * @param string|null $locale
     * @param array $filters
     * @param int $page
     * @param int $perPage
     *
     * @return array{
     *     products: array,
     *     total: int,
     *     price_range: array{
     *         min: int|null,
     *         max: int|null
     *     }
     * }
     */
    public function fullSearchProducts(
        string $search,
        ?string $locale = null,
        array $filters = [],
        int $page = 1,
        int $perPage = 20
    ): array;
}
