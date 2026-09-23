<?php

namespace App\Services;

use App\Actions\CreateAppLogAction;
use App\Dropshipping\DropshippingManager;
use App\Dropshipping\Mappers\CjProductMapper;
use App\Enums\AppLogLevelEnum;
use App\Enums\AppLogRealmEnum;
use App\Enums\ProductAiStatusEnum;
use App\Enums\ProductVariantAiStatusEnum;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductService
{
    public function __construct(
        private DropshippingManager $manager,
        private CjProductMapper $mapper,
        private ProductImageService $imageService,
        private CreateAppLogAction $createAppLogAction
    ) {}
    
    public function enrichProduct(Product $productToEnrich): void
    {
        $provider = $this->manager->driver();

        $this->createAppLogAction->execute(
            level: AppLogLevelEnum::INFO,
            realm: AppLogRealmEnum::PRODUCT,
            message: 'Product with ID: ' . $productToEnrich->id . ' (external_id: ' . $productToEnrich->external_id . ') enrichment started',
        );

        try {
            $productDetails = $provider->getProductDetails($productToEnrich->external_id);
        } catch (\Throwable $e) {
            $productToEnrich->update([
                'enrichment_failed_at' => now(),
                'enrichment_error' => $e->getMessage(),
            ]);

            $this->createAppLogAction->execute(
                level: AppLogLevelEnum::ERROR,
                realm: AppLogRealmEnum::PRODUCT,
                message: 'Product with ID: ' . $productToEnrich->id . ' (external_id: ' . $productToEnrich->external_id . ') enrichment failed while fetching product details from CJ. Error: ' . $e->getMessage(),
            );

            return;
        }

        try {
            $mappedDetails = $this->mapper->mapDetail($productDetails, $productToEnrich->toArray());

            DB::transaction(function () use ($productToEnrich, $mappedDetails) {
                $now = now();
                $nameChanged = $productToEnrich->name_raw !== $mappedDetails['name_raw'];

                $updates = [
                    'name_raw' => $mappedDetails['name_raw'],
                    'sku' => $mappedDetails['sku'],
                    'description_raw' => $mappedDetails['description_raw'],
                    'cost_price' => $mappedDetails['price'],
                    'price' => $this->generatePrice($mappedDetails['price']),
                    'now_price' => $mappedDetails['now_price'],
                    'suggested_price' => $mappedDetails['suggested_price'],
                    'add_mark_status' => $mappedDetails['add_mark_status'],
                    'updated_at' => $now,
                    'last_enrichment_at' => $now,
                    'product_weight' => $mappedDetails['product_weight'],
                    'packing_weight' => $mappedDetails['packing_weight'],
                    'enrichment_failed_at' => null,
                    'enrichment_error' => null,
                ];

                if ($nameChanged) {
                    $updates['ai_status'] = ProductAiStatusEnum::QUEUED;
                }

                $productToEnrich->update($updates);

                // Store and sync materials
                if (!empty($mappedDetails['material'])) {
                    $materials = array_values(array_filter($mappedDetails['material'] ?? []));
                    DB::table('materials')->upsert(
                        array_map(fn ($name) => ['name' => $name], $materials),
                        ['name']
                    );

                    $productMaterials = DB::table('materials')
                        ->whereIn('name', $materials)
                        ->pluck('id');

                    if (!empty($materials)) {
                        $productToEnrich->materials()->syncWithoutDetaching($productMaterials);
                    }
                }

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

                $productImages = DB::table('product_images')
                    ->where('product_id', $productToEnrich->id)
                    ->pluck('id', 'url');

                $existingVariants = DB::table('product_variants')
                    ->where('product_id', $productToEnrich->id)
                    ->get(['external_id', 'name', 'ai_status'])
                    ->keyBy('external_id');
                $variantsRows = array_map(function ($variant) use ($productToEnrich, $productImages, $now, $existingVariants) {
                    $existingVariant = $existingVariants->get($variant['external_id']);
                    $variantName = $variant['name'] ?? null;

                    $variantRow = [
                        'product_id' => $productToEnrich->id,
                        'external_id'  => $variant['external_id'],
                        'sku'          => $variant['sku'] ?? null,
                        'key'          => $variant['key'] ?? null,
                        'name'         => $variantName,
                        'cost_price'   => $variant['price'] ?? null,
                        'price'        => $this->generatePrice($variant['price']),
                        'stock'        => $variant['stock'] ?? null,
                        'weight'       => $variant['weight'] ?? null,
                        'volume'       => $variant['volume'] ?? null,
                        'image_id'     => $productImages[$variant['image']] ?? null,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];

                    if (
                        !$existingVariant ||
                        $existingVariant->name !== $variantName
                    ) {
                        $variantRow['ai_status'] = ProductVariantAiStatusEnum::QUEUED;
                    }
                    return $variantRow;
                }, $mappedDetails['variants']);

                // Upsert variants
                DB::table('product_variants')->upsert(
                    $variantsRows,
                    ['external_id']
                );
            });
        } catch (\Throwable $e) {
            $productToEnrich->update([
                'enrichment_failed_at' => now(),
                'enrichment_error' => $e->getMessage(),
            ]);

            $this->createAppLogAction->execute(
                level: AppLogLevelEnum::ERROR,
                realm: AppLogRealmEnum::PRODUCT,
                message: 'Product with ID: ' . $productToEnrich->id .
                    ' (external_id: ' . $productToEnrich->external_id .
                    ') enrichment failed during processing. Error: ' .
                    $e->getMessage(),
            );

            return;
        }

        $this->createAppLogAction->execute(
            level: AppLogLevelEnum::SUCCESS,
            realm: AppLogRealmEnum::PRODUCT,
            message: 'Product with ID: ' . $productToEnrich->id . ' (external_id: ' . $productToEnrich->external_id . ') enrichment completed successfully',
        );
    }

    /*
    * 1) Used as base query for getting products in category page
    * 2) Used as base query for getting filters in category page
    */
    public function baseCategoryQuery(Request $request)
    {
        $query = Product::query();
        $query->whereNotNull('last_enrichment_at');
        $query->whereNotNull('ai_texts_at');
        $query->whereNull('enrichment_failed_at');

        $slugArray = $request->category;
        $lastSlug = end($slugArray);
        $slugs = app(CategoryService::class)->getChildrenSlugs($lastSlug);

        if ($request->filled('category')) {
            $query->whereHas('categories', function ($q) use ($slugs) {
                $q->whereIn('slug', $slugs);
            })
            ->whereHas('categories', function ($q) {
                $q->where('is_visible', true);
            });
        }

        return $query;
    }

    public function generatePrice(int $costPrice): int
    {
        $multiplier = $costPrice < 10000
            ? 1.61
            : 1.51;

        return (int) round($costPrice * $multiplier);
    }
}
