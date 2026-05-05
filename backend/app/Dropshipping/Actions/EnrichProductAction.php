<?php

namespace App\Dropshipping\Actions;

use App\Dropshipping\DropshippingManager;
use App\Dropshipping\Mappers\CjProductMapper;
use App\Jobs\AiProcessImagesProductJob;
use App\Models\Product;
use App\Services\ProductImageService;
use Illuminate\Support\Facades\DB;

class EnrichProductAction
{
    public function __construct(
        private DropshippingManager $manager,
        private CjProductMapper $mapper,
        private ProductImageService $imageService
    ) {}

    public function execute(): void
    {
        // get product to enrich
        $productToEnrich = Product::where(function ($q) {
            $q->whereNull('last_enrichment_at')
            ->orWhere('last_enrichment_at', '<', now()->minus(weeks: 4));
        })->orderBy('id')->first();

        if (!$productToEnrich) {
            return;
        }

        $provider = $this->manager->driver();

        $productDetails = $provider->getProductDetails($productToEnrich->external_id);
        $mappedDetails = $this->mapper->mapDetail($productDetails, $productToEnrich->toArray());

        DB::transaction(function () use ($productToEnrich, $mappedDetails) {
            $bigImage = null;

            // store big_image
            if ($mappedDetails['big_image']) {
                $bigImage = $this->imageService->downloadAndStore($mappedDetails['big_image'], $productToEnrich->id);
            }

            $now = now();
            $productToEnrich->update([
                'name_raw' => $mappedDetails['name_raw'],
                'description_raw' => $mappedDetails['description_raw'],
                'price' => $mappedDetails['price'],
                'now_price' => $mappedDetails['now_price'],
                'suggested_price' => $mappedDetails['suggested_price'],
                'big_image' => $bigImage ?? $mappedDetails['big_image'],
                'add_mark_status' => $mappedDetails['add_mark_status'],
                // 'images' => $mappedDetails['images'],
                'updated_at' => $now,
                'last_enrichment_at' => $now
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

            // Store images
            if($mappedDetails['images']) {
                foreach ($mappedDetails['images'] as $key =>$imageUrl) {
                    $this->imageService->storeOriginal($productToEnrich->id, $imageUrl, $key);
                }
            }
        });

        // dispatch ai job for images
        AiProcessImagesProductJob::dispatch($productToEnrich->id);
    }
}
