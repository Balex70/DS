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

    public function updateVariantStock(ProductVariant $productVariant): ?ProductVariant
    {
        $provider = $this->manager->driver();

        $this->createAppLogAction->execute(
            level: AppLogLevelEnum::INFO,
            realm: AppLogRealmEnum::PRODUCT,
            message: 'Product variant with ID: ' . $productVariant->id . ' (external_id(vid): ' . $productVariant->external_id . ') stock update started',
        );

        try {
            $stock = $provider->getVariantStock($productVariant->external_id);

            if($stock === null) {
                return null;
            }
            $productVariant->update([
                'stock' => $stock,
                'stock_synced_at' => now(),
            ]);
        } catch (\Throwable $e) {
            $this->createAppLogAction->execute(
                level: AppLogLevelEnum::ERROR,
                realm: AppLogRealmEnum::PRODUCT,
                message: 'Product variant with ID: ' . $productVariant->id . ' (external_id(vid): ' . $productVariant->external_id . ') stock update failed while fetching variant stock data from CJ. Error: ' . $e->getMessage(),
            );

            return null;
        }

        $this->createAppLogAction->execute(
            level: AppLogLevelEnum::SUCCESS,
            realm: AppLogRealmEnum::PRODUCT,
            message: 'Product variant with ID: ' . $productVariant->id . ' (external_id(vid): ' . $productVariant->external_id . ') stock update completed successfully',
        );

        return $productVariant->fresh();
    }
}
