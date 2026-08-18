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
        $productToEnrich = Product::where(function ($q) {
            $q->whereNull('last_enrichment_at')
            ->orWhere('last_enrichment_at', '<', now()->minus(weeks: 8));
        })
        ->whereNull('enrichment_failed_at')
        ->orderBy('id')->first();

        if (!$productToEnrich) {
            return;
        }

        $this->productService->enrichProduct($productToEnrich);
    }
}
