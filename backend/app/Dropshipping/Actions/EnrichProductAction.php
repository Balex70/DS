<?php

namespace App\Dropshipping\Actions;

use App\Models\Product;
use App\Services\ProductService;

class EnrichProductAction
{
    public function __construct(
        private ProductService $productService
    ) {}

    public function execute(): void
    {
        // get product to enrich
        $productToEnrich = Product::query()
            ->whereNull('enrichment_failed_at')
            ->orderByRaw('last_enrichment_at IS NOT NULL') // for ordering, take products that was not enriched yet
            ->orderBy('last_enrichment_at')
            ->orderBy('id')
            ->first();

        if (!$productToEnrich) {
            return;
        }

        $this->productService->enrichProduct($productToEnrich);
    }
}
