<?php

namespace App\Services;

use App\Actions\CreateAppLogAction;
use App\Enums\AppLogLevelEnum;
use App\Enums\AppLogRealmEnum;
use App\Models\Product;
use App\SearchEngine\SearchEngineManager;

class ProductSearchIndexer
{
    public function __construct(
        private CreateAppLogAction $createAppLogAction,
        private SearchEngineManager $searchEngineManager,
    ) {
    }

    public function indexProduct(int $productId): void
    {
        try {
            $product = Product::query()
                ->with([
                    'translations',
                    'bigImage',
                    'cheapestVariant',
                    'materials.translations',
                    'variants.translations',
                ])
                ->find($productId);

            if (!$product) {
                return;
            }

            $this->searchEngineManager
                ->driver()
                ->indexProduct(
                    $this->buildSearchIndexDocument($product)
                );

            $this->createAppLogAction->execute(
                level: AppLogLevelEnum::SUCCESS,
                realm: AppLogRealmEnum::PRODUCT,
                message: "Product with ID: {$product->id} (external_id: {$product->external_id}) added to search engine index",
            );
        } catch (\Throwable $e) {
            $this->createAppLogAction->execute(
                level: AppLogLevelEnum::ERROR,
                realm: AppLogRealmEnum::PRODUCT,
                message: "Failed to index product ID: {$productId}. Error: {$e->getMessage()}",
            );
        }
    }

    public function deleteProduct(int $productId): void
    {
        try {
            $this->searchEngineManager
                ->driver()
                ->deleteProduct($productId);
        } catch (\Throwable $e) {
            $this->createAppLogAction->execute(
                level: AppLogLevelEnum::ERROR,
                realm: AppLogRealmEnum::PRODUCT,
                message: "Failed to delete product from search index, product ID: {$productId}. Error: {$e->getMessage()}",
            );
        }
    }
    
    public function reindexProducts(): void
    {
        $provider = $this->searchEngineManager->driver();

        $provider->clearProductsIndex();

        Product::query()
        ->with([
            'translations',
            'bigImage',
            'cheapestVariant',
            'materials.translations',
            'variants.translations',
        ])
        ->chunkById(100, function ($products) use ($provider) {
            $documents = $products
                ->map(fn ($product) => $this->buildSearchIndexDocument($product))
                ->all();

            $provider->bulkIndexProducts($documents);
        });
    }

    private function buildSearchIndexDocument(Product $product): array
    {
        return [
            'id' => $product->id,
            'external_id' => $product->external_id,
            'name_raw' => $product->name_raw,
            'name_processed' => $product->name_processed,
            'slug' => $product->slug,
            'price' => $product->price,
            'big_image' => $product->bigImage,

            'cheapest_variant' => $product->cheapestVariant
                ? [
                    'id' => $product->cheapestVariant->id,
                    'external_id' => $product->cheapestVariant->external_id,
                    'price' => $product->cheapestVariant->price,
                    // Add other fields needed by the storefront
                ]
                : null,

            'created_at' => $product->created_at?->toISOString(),
            'updated_at' => $product->updated_at?->toISOString(),
            'last_enrichment_at' => $product->last_enrichment_at?->toISOString(),
            'ai_texts_at' => $product->ai_texts_at?->toISOString(),
            'enrichment_failed_at' => $product->enrichment_failed_at?->toISOString(),

            'translations' => $product->translations
                ->map(fn ($translation) => [
                    'locale' => $translation->locale,
                    'name' => $translation->name,
                    'description' => $translation->description,
                    'translated_at' => $translation->translated_at?->toISOString(),
                ])
                ->all(),

            'materials' => $product->materials
                ->map(fn ($material) => [
                    'id' => $material->id,
                    'name' => $material->name,
                    'translations' => $material->translations
                        ->map(fn ($translation) => [
                            'locale' => $translation->locale,
                            'name' => $translation->name,
                        ])
                        ->all(),
                ])
                ->all(),
            'visible_category_ids' => $product->categories()
                ->where('is_visible', true)
                ->pluck('categories.id')
                ->all(),
            'variants' => $product->variants
                ->map(fn ($variant) => [
                    'id' => $variant->id,
                    'name' => $variant->name,
                    'name_processed' => $variant->name_processed,
                    'translations' => $variant->translations
                        ->map(fn ($translation) => [
                            'locale' => $translation->locale,
                            'name' => $translation->name,
                        ])
                        ->all(),
                ])
                ->all(),
        ];
    }
}
