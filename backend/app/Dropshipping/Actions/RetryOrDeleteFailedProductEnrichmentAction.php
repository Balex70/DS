<?php

namespace App\Dropshipping\Actions;

use App\Actions\CreateAppLogAction;
use App\Enums\AppLogLevelEnum;
use App\Enums\AppLogRealmEnum;
use App\Models\Product;
use App\Services\ProductService;

class RetryOrDeleteFailedProductEnrichmentAction
{
    public function __construct(
        private ProductService $productService,
        private CreateAppLogAction $createAppLogAction
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

        $productId = $productToRetry->id;
        $productName = $productToRetry->name_raw;
        $productToRetry->delete();

        $this->createAppLogAction->execute(
            AppLogLevelEnum::INFO,
            AppLogRealmEnum::PRODUCT,
            "Product with ID: {$productId} with name: {$productName} was deleted because it has no orders and enrichment failed."
        );
    }
}
