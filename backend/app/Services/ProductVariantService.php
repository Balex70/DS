<?php

namespace App\Services;

use App\Actions\CreateAppLogAction;
use App\Dropshipping\DropshippingManager;
use App\Dropshipping\Mappers\CjProductMapper;
use App\Enums\AppLogLevelEnum;
use App\Enums\AppLogRealmEnum;
use App\Models\ProductVariant;

class ProductVariantService
{
    public function __construct(
        private DropshippingManager $manager,
        private CjProductMapper $mapper,
        private CreateAppLogAction $createAppLogAction
    ) {}

    public function updateVariantStock(ProductVariant $productVariant): void
    {
        $provider = $this->manager->driver();

        $this->createAppLogAction->execute(
            level: AppLogLevelEnum::INFO,
            realm: AppLogRealmEnum::PRODUCT,
            message: 'Product variant with ID: ' . $productVariant->id . ' (vid: ' . $productVariant->vid . ') stock update started',
        );

        try {
            $stockData = $provider->getVariantStock($productVariant->external_id);
            \Log::info($stockData);
        } catch (\Throwable $e) {
            // $productVariant->update([
            //     'enrichment_failed_at' => now(),
            //     'enrichment_error' => $e->getMessage(),
            // ]);

            $this->createAppLogAction->execute(
                level: AppLogLevelEnum::ERROR,
                realm: AppLogRealmEnum::PRODUCT,
                message: 'Product variant with ID: ' . $productVariant->id . ' (vid: ' . $productVariant->vid . ') stock update failed while fetching variant stock data from CJ. Error: ' . $e->getMessage(),
            );

            return;
        }

        $this->createAppLogAction->execute(
            level: AppLogLevelEnum::SUCCESS,
            realm: AppLogRealmEnum::PRODUCT,
            message: 'Product variant with ID: ' . $productVariant->id . ' (vid: ' . $productVariant->vid . ') stock update completed successfully',
        );
    }
}
