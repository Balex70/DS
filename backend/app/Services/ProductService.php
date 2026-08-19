<?php

namespace App\Services;

use App\Dropshipping\DropshippingManager;
use App\Dropshipping\Mappers\CjProductMapper;
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
        private ProductImageService $imageService
    ) {}
    
    public function enrichProduct(Product $productToEnrich): void
    {
        $provider = $this->manager->driver();

        try {
            $productDetails = $provider->getProductDetails($productToEnrich->external_id);
        } catch (\Throwable $e) {
            $productToEnrich->update([
                'enrichment_failed_at' => now(),
                'enrichment_error' => $e->getMessage(),
            ]);

            return;
        }

        $mappedDetails = $this->mapper->mapDetail($productDetails, $productToEnrich->toArray());

        DB::transaction(function () use ($productToEnrich, $mappedDetails) {
            $now = now();
            $productToEnrich->update([
                'name_raw' => $mappedDetails['name_raw'],
                'sku' => $mappedDetails['sku'],
                'description_raw' => $mappedDetails['description_raw'],
                'cost_price' => $mappedDetails['price'],
                'price' => $this->generatePrice($mappedDetails['price']),
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

            $variantsRows = array_map(function ($variant) use ($productToEnrich, $productImages, $now) {
                return [
                    'product_id' => $productToEnrich->id,
                    'external_id'  => $variant['external_id'],
                    'sku'          => $variant['sku'] ?? null,
                    'key'          => $variant['key'] ?? null,
                    'name'         => $variant['name'] ?? null,
                    'cost_price'   => $variant['price'] ?? null,
                    'price'        => $this->generatePrice($variant['price']),
                    'stock'        => $variant['stock'] ?? null,
                    'weight'       => $variant['weight'] ?? null,
                    'volume'       => $variant['volume'] ?? null,
                    'image_id'     => $productImages[$variant['image']] ?? null,
                    'created_at' => $now,
                    'updated_at' => $now,
                    'ai_status' => ProductVariantAiStatusEnum::QUEUED,
                ];
            }, $mappedDetails['variants']);

            // Upsert variants
            DB::table('product_variants')->upsert(
                $variantsRows,
                ['external_id']
            );
        });
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
            });
        }

        return $query;
    }

    public function generatePrice(int $costPrice): string
    {
        $multiplier = $costPrice < 10000
            ? 1.61
            : 1.51;

        return (int) round($costPrice * $multiplier);
    }
}
