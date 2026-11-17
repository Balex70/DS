<?php

namespace App\Services;

use App\Actions\CreateAppLogAction;
use App\Currency\Services\PriceConverter;
use App\Dropshipping\DropshippingManager;
use App\Dropshipping\Mappers\CjProductMapper;
use App\Enums\AppLogLevelEnum;
use App\Enums\AppLogRealmEnum;
use App\Enums\CurrenciesEnum;
use App\Enums\LocalesEnum;
use App\Enums\ProductAiStatusEnum;
use App\Enums\ProductVariantAiStatusEnum;
use App\Models\Material;
use App\Models\Product;
use App\SearchEngine\SearchEngineManager;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ProductService
{
    public function __construct(
        private DropshippingManager $manager,
        private CjProductMapper $mapper,
        private ProductImageService $imageService,
        private CreateAppLogAction $createAppLogAction,
        private SearchEngineManager $searchEngineManager,
        private ProductSearchIndexer $productSearchIndexer,
        private CategoryService $categoryService,
        private PriceConverter $converter
    ) {
    }

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
                $shouldQueue = $this->productNeedsAiEnrichment(
                    $productToEnrich->ai_status,
                    $productToEnrich->name_raw,
                    $mappedDetails['name_raw'],
                );

                $updates = [
                    'name_raw' => $mappedDetails['name_raw'],
                    'sku' => $mappedDetails['sku'],
                    'description_raw' => $mappedDetails['description_raw'],
                    'cost_price' => $mappedDetails['price'],
                    'price' => $this->generatePrice($mappedDetails['price']),
                    'now_price' => $mappedDetails['now_price'],
                    'suggested_price' => $mappedDetails['suggested_price'],
                    'add_mark_status' => $mappedDetails['add_mark_status'],
                    'warehouse_inventory_num' => $mappedDetails['warehouse_inventory_num'],
                    'raw_data' => $mappedDetails['raw_data'],
                    'updated_at' => $now,
                    'last_enrichment_at' => $now,
                    'product_weight' => $mappedDetails['product_weight'],
                    'packing_weight' => $mappedDetails['packing_weight'],
                    'enrichment_failed_at' => null,
                    'enrichment_error' => null,
                ];

                if ($shouldQueue) {
                    $updates['ai_status'] = ProductAiStatusEnum::QUEUED;
                }

                $productToEnrich->skipSearchIndexing(); // Skip indexing because we use explicit indexing
                $productToEnrich->update($updates);
                $productToEnrich->skipSearchIndexing(false);

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
                if ($mappedDetails['images']) {
                    foreach ($mappedDetails['images'] as $key => $imageUrl) {
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

                    $aiStatus = $existingVariant?->ai_status;
                    if (
                        !$existingVariant ||
                        $this->productVariantNeedsAiEnrichment(
                            $existingVariant->ai_status,
                            $existingVariant->name,
                            $variantName,
                        )
                    ) {
                        $aiStatus = ProductVariantAiStatusEnum::QUEUED->value;
                    }

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
                        'ai_status'    => $aiStatus,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];

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

        $this->productSearchIndexer->indexProduct($productToEnrich->id);
    }

    public function getCategoryProducts(array $filters): LengthAwarePaginator
    {
        $query = $this->baseCategoryQuery($filters);
        $query->with('cheapestVariant');

        $locale = $filters['locale'] ?? null;
        $sort = $filters['sort'] ?? null;
        $price = $filters['price'] ?? null;
        $materialIds = $filters['activeMaterials'] ?? null;
        $currency = $filters['currency'] ?? null;

        if ($locale && LocalesEnum::tryFrom($locale)) {
            $query->with([
                'translation' => fn ($q) => $q->where('locale', $locale),
                'materials.translation' => fn ($q) => $q->where('locale', $locale),
            ]);
        }

        match ($sort ?? 'latest') {
            'latest' => $query->orderByDesc('created_at')->orderByDesc('id'),
            'price_asc' => $query->orderBy('price')->orderBy('id'),
            'price_desc' => $query->orderByDesc('price')->orderBy('id'),
            default => $query->orderByDesc('created_at')->orderByDesc('id'),
        };

        if ($price && count($price) === 2) {
            $query->whereBetween('price', [
                $price[0],
                $price[1],
            ]);

            // TODO: can use variants but not sure if necessary for now (and it slower and requires show price range in products list)
            // $query->whereHas('variants', function ($q) use ($request) {
            //     $q->whereBetween('price', [
            //         $request->price[0],
            //         $request->price[1],
            //     ]);
            // });
        }

        if (!empty($materialIds)) {
            $materialNames = Material::query()
                ->whereIn('id', $materialIds)
                ->selectRaw('LOWER(TRIM(name)) as normalized_name')
                ->distinct()
                ->pluck('normalized_name');

            $matchingMaterialIds = Material::query()
                ->whereIn(
                    DB::raw('LOWER(TRIM(name))'),
                    $materialNames
                )
                ->pluck('id');

            $query->whereHas('materials', function ($q) use ($matchingMaterialIds) {
                $q->whereIn('materials.id', $matchingMaterialIds);
            });
        }

        $products = $query->paginate(24);

        if ($currency) {
            $products->each(function (Product $product) use ($currency) {
                $product->currency_price = $this->converter->convert(
                    $product->price,
                    CurrenciesEnum::USD->value,
                    $currency,
                );
            });
        }

        return $products;
    }

    public function getFilters(array $filters): array
    {
        $query = $this->baseCategoryQuery($filters);

        $locale = $filters['locale'] ?? null;

        $baseWithVariants = $query->join('product_variants', 'products.id', '=', 'product_variants.product_id');

        // PRICE RANGE (clone to avoid query mutation)
        $price = (clone $baseWithVariants)
            ->selectRaw('MIN(products.price) as min, MAX(products.price) as max')
            ->first();

        // MATERIALS (clone to avoid query mutation)
        $materialsQuery = Material::query()
            ->whereHas('products', function ($q) use ($query) {
                $q->whereIn(
                    'products.id',
                    (clone $query)->select('products.id')
                );
            });
        if ($locale && LocalesEnum::tryFrom($locale)) {
            $materialsQuery->with([
                'translation' => fn ($q) => $q->where('locale', $locale),
            ]);
        }
        $materials = $materialsQuery->select('id', 'name')->get();

        // WEIGHT RANGE
        // $weight = $base
        //     ->join('product_variants', 'products.id', '=', 'product_variants.product_id')
        //     ->selectRaw('MIN(product_variants.weight) as min, MAX(product_variants.weight) as max')
        //     ->first();

        return [
            'price' => $price,
            'materials' => $materials,
            'weight' => [],
        ];
    }

    /*
    * 1) Used as base query for getting products in category page
    * 2) Used as base query for getting filters in category page
    */
    public function baseCategoryQuery(array $filters): Builder
    {
        $query = Product::query();
        $query->whereNotNull('last_enrichment_at');
        $query->whereNotNull('ai_texts_at');
        $query->whereNull('enrichment_failed_at');

        $category = $filters['category'] ?? null;

        if ($category) {
            $allChildrenIds = $this->categoryService->getCategoryAndChildrenIds($category);

            $query->whereHas('categories', function ($q) use ($allChildrenIds) {
                $q->whereIn('id', $allChildrenIds);
            })
            ->whereHas('categories', function ($q) {
                $q->where('is_visible', true);
            });
        }

        return $query;
    }

    public function getLatestProducts(array $filters, int $limit): Collection
    {
        $query = Product::query()
            ->whereNotNull('last_enrichment_at')
            ->whereNotNull('ai_texts_at')
            ->whereNull('enrichment_failed_at')
            ->whereHas('categories', function ($q) {
                $q->where('categories.is_visible', true);
            })
            ->with('cheapestVariant');

        $locale = $filters['locale'] ?? null;

        if ($locale && LocalesEnum::tryFrom($locale)) {
            $query->with([
                'translation' => fn ($q) => $q->where('locale', $locale),
            ]);
        }

        $products = $query
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->limit($limit)
            ->get();

        $currency = $filters['currency'] ?? null;

        if ($currency) {
            $products->each(function (Product $product) use ($currency) {
                $product->currency_price = $this->converter->convert(
                    $product->price,
                    CurrenciesEnum::USD->value,
                    $currency,
                );
            });
        }

        return $products;
    }

    public function generatePrice(int $costPrice): int
    {
        $multiplier = $costPrice < 10000
            ? 1.61
            : 1.51;

        return (int) round($costPrice * $multiplier);
    }

    private function productNeedsAiEnrichment(
        ?string $status,
        ?string $currentName,
        ?string $newName,
    ): bool {
        return $status === null ||
            $status === ProductAiStatusEnum::PROCESSING->value ||
            $status === ProductAiStatusEnum::FAILED->value ||
            (
                $status === ProductAiStatusEnum::DONE->value &&
                $currentName !== $newName
            );
    }

    private function productVariantNeedsAiEnrichment(
        ?string $status,
        ?string $currentName,
        ?string $newName,
    ): bool {
        return $status === null ||
            $status === ProductVariantAiStatusEnum::PROCESSING->value ||
            $status === ProductVariantAiStatusEnum::FAILED->value ||
            (
                $status === ProductVariantAiStatusEnum::DONE->value &&
                $currentName !== $newName
            );
    }

    public function reindexProducts(): void
    {
        $this->createAppLogAction->execute(
            level: AppLogLevelEnum::INFO,
            realm: AppLogRealmEnum::PRODUCT,
            message: 'Products reindex started',
        );

        $this->productSearchIndexer->reindexProducts();

        $this->createAppLogAction->execute(
            level: AppLogLevelEnum::SUCCESS,
            realm: AppLogRealmEnum::PRODUCT,
            message: 'Products reindex completed',
        );
    }

    public function configProductsIndex(): void
    {
        $this->createAppLogAction->execute(
            level: AppLogLevelEnum::INFO,
            realm: AppLogRealmEnum::PRODUCT,
            message: 'Configuring products index started',
        );

        $this->productSearchIndexer->configProductsIndex();

        $this->createAppLogAction->execute(
            level: AppLogLevelEnum::SUCCESS,
            realm: AppLogRealmEnum::PRODUCT,
            message: 'Configuring products index completed',
        );
    }
}
