<?php

namespace App\Http\Controllers\Api;

use App\Actions\CreateAppLogAction;
use App\Enums\AppLogLevelEnum;
use App\Enums\AppLogRealmEnum;
use App\Enums\ProductAiStatusEnum;
use App\Enums\ProductVariantAiStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Jobs\ReindexProductsJob;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Services\ProductSearchIndexer;
use App\Services\ProductService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class ProductController extends Controller
{
    public function __construct(
        private ProductService $service,
        private CreateAppLogAction $createAppLogAction,
        private ProductSearchIndexer $productSearchIndexer
    ) {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Product::class);

        $filters = $request->only([
            'search',
            'categoryIds',
            'enrichStatuses',
            'aiStatuses',
            'aiTextsProcessed',
            'suspiciousPrices',
        ]);

        return ProductResource::collection(
            $this->service->getAdminProducts($filters)
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        Gate::authorize('update', $product);

        $product = $this->service->updateProduct(
            $product,
            $request->validated()
        );

        return new ProductResource($product);
    }

    /**
     * Update the ai status only
     */
    public function changeAiStatus(Product $product, ProductAiStatusEnum $newAiStatus)
    {
        Gate::authorize('update', $product);
        $product->update([
            'ai_status' => $newAiStatus,
        ]);

        return response()->json([
            'message' => 'AI status updated successfully',
        ]);
    }

    /**
     * Remove translations for product
     */
    public function removeTranslations(Product $product)
    {
        Gate::authorize('update', $product);
        $product->translations()->delete();
        $this->productSearchIndexer->indexProduct($product->id);

        $this->createAppLogAction->execute(
            AppLogLevelEnum::SUCCESS,
            AppLogRealmEnum::PRODUCT,
            "Translations for product removed:
ID: {$product->id} ($product->name_processed)"
        );

        return response()->json([
            'message' => 'Translations for product removed successfully',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        Gate::authorize('delete', $product);

        $productId = $product->id;
        $productName = $product->name_raw;

        // Disallow deleting a product that has orders
        if ($product->hasOrders()) {
            $this->createAppLogAction->execute(
                AppLogLevelEnum::INFO,
                AppLogRealmEnum::PRODUCT,
                "Product with ID: {$productId} with name: {$productName} tried to delete but failed because it has orders."
            );
            abort(409, 'Cannot delete a product that has orders.');
        }

        $product->delete();

        $this->createAppLogAction->execute(
            AppLogLevelEnum::INFO,
            AppLogRealmEnum::PRODUCT,
            "Product with ID: {$productId} with name: {$productName} was manually deleted."
        );

        return response()->noContent();
    }

    public function enrich(Product $product)
    {
        Gate::authorize('enrich', $product);

        $this->service->enrichProduct($product);

        return response()->json(['message' => 'Product enriched'], 200);
    }

    public function reindexProducts()
    {
        Gate::authorize('viewAny', Product::class);

        ReindexProductsJob::dispatch();

        return response()->json(['message' => 'Products reindex queued'], 202);
    }

    public function configProductsIndex()
    {
        Gate::authorize('viewAny', Product::class);

        $this->service->configProductsIndex();

        return response()->json(['message' => 'Products index configured successfully'], 200);
    }

    public function aiTextsNext()
    {
        $productToProcess = DB::transaction(function () {
            $nextProduct = Product::where('ai_status', ProductAiStatusEnum::QUEUED)
                ->whereNotNull('last_enrichment_at')
                ->orderBy('id')
                ->lockForUpdate()
                ->first();

            if (!$nextProduct) {
                return null;
            }

            $nextProduct->update([
                'ai_status' => ProductAiStatusEnum::PROCESSING
            ]);

            return $nextProduct;
        });

        if (!$productToProcess) {
            return response()->json(null, 204);
        }

        return response()->json([
            'id' => $productToProcess->id,
            'product_name' => $productToProcess->name_raw,
            'description' => $productToProcess->description_raw
        ]);
    }

    public function aiVariantTextsNext()
    {
        $productVariantToProcess = DB::transaction(function () {
            $nextProductVariant = ProductVariant::where('ai_status', ProductVariantAiStatusEnum::QUEUED)
                ->orderBy('id')
                ->lockForUpdate()
                ->first();

            if (!$nextProductVariant) {
                return null;
            }

            $nextProductVariant->update([
                'ai_status' => ProductVariantAiStatusEnum::PROCESSING
            ]);

            return $nextProductVariant;
        });

        if (!$productVariantToProcess) {
            return response()->json(null, 204);
        }

        return response()->json([
            'id' => $productVariantToProcess->id,
            'product_id' => $productVariantToProcess->product_id,
            'variant_name' => $productVariantToProcess->name,
        ]);
    }

    public function aiTextsTranslateNext(string $locale)
    {
        $productToProcess = DB::transaction(function () use ($locale) {
            $query = Product::where('ai_status', ProductAiStatusEnum::DONE)
                ->whereDoesntHave('translations', function ($q) use ($locale) {
                    $q->where('locale', $locale);
                });

            $product = $query
                ->with('translations')
                ->orderBy('id')
                ->lockForUpdate()
                ->first();

            return $product;
        });

        if (!$productToProcess) {
            return response()->json(null, 204);
        }

        return response()->json([
            'id' => $productToProcess->id,
            'product_name' => $productToProcess->name_processed,
            'description' => $productToProcess->description_processed
        ]);
    }

    public function aiVariantTextsTranslateNext(string $locale)
    {
        $productVariantToProcess = DB::transaction(function () use ($locale) {
            $query = ProductVariant::where('ai_status', ProductVariantAiStatusEnum::DONE)
                ->whereDoesntHave('translations', function ($q) use ($locale) {
                    $q->where('locale', $locale);
                });

            $product = $query
                ->with('translations')
                ->orderBy('id')
                ->lockForUpdate()
                ->first();

            return $product;
        });

        if (!$productVariantToProcess) {
            return response()->json(null, 204);
        }

        return response()->json([
            'id' => $productVariantToProcess->id,
            'product_id' => $productVariantToProcess->product_id,
            'variant_name' => $productVariantToProcess->name
        ]);
    }

    public function aiTextsComplete(Product $product, Request $request)
    {
        $product->update([
            'name_processed' => $request->title,
            'description_processed' => $request->description,
            'ai_texts_at' => now(),
            'ai_status' => ProductAiStatusEnum::DONE
        ]);

        $this->createAppLogAction->execute(
            AppLogLevelEnum::SUCCESS,
            AppLogRealmEnum::PRODUCT,
            "Text generated by AI for product:
ID: {$product->id} ($product->name_raw)
New name: {$product->name_processed}
New description: {$product->description_processed}"
        );

        return response()->json(['ok' => true]);
    }

    public function aiVariantTextsComplete(ProductVariant $productVariant, Request $request)
    {
        $productVariant->update([
            'name_processed' => $request->title,
            'ai_status' => ProductVariantAiStatusEnum::DONE
        ]);

        $this->createAppLogAction->execute(
            AppLogLevelEnum::SUCCESS,
            AppLogRealmEnum::PRODUCT,
            "Text generated by AI for product variant:
ID: {$productVariant->id} ({$productVariant->name})
Product ID: {$productVariant->product_id} ({$productVariant->product->name})
New name: {$productVariant->name_processed}"
        );

        return response()->json(['ok' => true]);
    }

    public function aiTextsTranslateComplete(Product $product, Request $request)
    {
        $data = $request->all();

        // 2. Sync translations
        if (isset($data['locale'])) {
            $translatedTitle = $data['title'] ?? null;
            $translatedDescription = $data['description'] ?? null;
            $product->translations()->updateOrCreate(
                [
                    'locale' => $data['locale'],
                ],
                [
                    'name' => $translatedTitle,
                    'description' => $translatedDescription,
                    'translated_at' => now(),
                ]
            );

            $this->createAppLogAction->execute(
                AppLogLevelEnum::SUCCESS,
                AppLogRealmEnum::PRODUCT,
                "Text translation generated by AI for product:
Locale: {$data['locale']}
ID: {$product->id} ($product->name_processed)
Name translation: {$translatedTitle}
Description translation: {$translatedDescription}"
            );
        }

        return response()->json(['ok' => true]);
    }

    public function aiVariantTextsTranslateComplete(ProductVariant $productVariant, Request $request)
    {
        $data = $request->all();

        // 2. Sync translations
        if (isset($data['locale'])) {
            $translatedTitle = $data['title'] ?? null;
            $productVariant->translations()->updateOrCreate(
                [
                    'locale' => $data['locale'],
                ],
                [
                    'name' => $translatedTitle,
                    'translated_at' => now(),
                ]
            );

            $this->createAppLogAction->execute(
                AppLogLevelEnum::SUCCESS,
                AppLogRealmEnum::PRODUCT,
                "Text translation generated by AI for product variant:
Locale: {$data['locale']}
ID: {$productVariant->id} ({$productVariant->name})
Product ID: {$productVariant->product_id} ({$productVariant->product->name})
Name translation: {$translatedTitle}"
            );
        }

        return response()->json(['ok' => true]);
    }
}
