<?php

namespace App\Dropshipping\Actions;

use App\Models\Product;
use App\Services\ProductService;

class RetryOrDeleteFailedProductEnrichmentAction
{
    public function __construct(
        private ProductService $productService
    ) {}

    public function execute(): void
    {
        // get product to try/check
        $productToRetry = Product::query()
            ->whereNotNull('enrichment_failed_at')
            ->orderBy('enrichment_failed_at')
            ->first();

        if (!$productToRetry) {
            return;
        }

        $this->productService->enrichProduct($productToRetry);
        $productToRetry->refresh();

        // Enrichment succeeded.
        if ($productToRetry->enrichment_failed_at === null) {
            return;
        }

        // Enrichment failed again.
        if ($productToRetry->hasOrders()) {
            return;
        }

        $productToRetry->delete();
    }
}
