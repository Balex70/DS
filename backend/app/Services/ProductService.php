<?php

namespace App\Services;

use App\Dropshipping\DropshippingManager;
use App\Dropshipping\Mappers\CjProductMapper;
use App\Enums\ProductAiStatusEnum;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class ProductService
{
    public function __construct(
        private DropshippingManager $manager,
        private CjProductMapper $mapper,
        private ProductImageService $imageService
    ) {}
    
    public function enrichProduct(Product $productToEnrich): void
    {
        $provider = $this->manager->driver();

        $productDetails = $provider->getProductDetails($productToEnrich->external_id);
        $mappedDetails = $this->mapper->mapDetail($productDetails, $productToEnrich->toArray());

        DB::transaction(function () use ($productToEnrich, $mappedDetails) {
            $now = now();
            $productToEnrich->update([
                'name_raw' => $mappedDetails['name_raw'],
                'sku' => $mappedDetails['sku'],
                'description_raw' => $mappedDetails['description_raw'],
                'price' => $mappedDetails['price'],
                'now_price' => $mappedDetails['now_price'],
                'suggested_price' => $mappedDetails['suggested_price'],
                'add_mark_status' => $mappedDetails['add_mark_status'],
                // 'images' => $mappedDetails['images'],
                'updated_at' => $now,
                'last_enrichment_at' => $now,
                'ai_status' => ProductAiStatusEnum::QUEUED,
                'product_weight' => $mappedDetails['product_weight'],
                'packing_weight' => $mappedDetails['packing_weight'],
            ]);

            $variantsRows = array_map(function ($variant) use ($productToEnrich, $now) {
                return [
                    ...$variant,
                    'product_id' => $productToEnrich->id,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }, $mappedDetails['variants']);

            // Upsert variants
            DB::table('product_variants')->upsert(
                $variantsRows,
                ['external_id']
            );

            // Store big image
            if (!empty($mappedDetails['big_image'])) {
                $this->imageService->syncOriginal(
                    $productToEnrich->id,
                    $mappedDetails['big_image'],
                    0,
                    'big',
                );
            }

            // Store images
            if($mappedDetails['images']) {
                foreach ($mappedDetails['images'] as $key =>$imageUrl) {
                    $this->imageService->syncOriginal($productToEnrich->id, $imageUrl, $key, null);
                }
            }
        });
    }
}
