<?php

namespace App\Dropshipping\Actions;

use App\Dropshipping\DropshippingManager;
use App\Models\Category;
use App\Models\CategorySyncState;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class SyncCategoryProductsAction
{
    public function __construct(
        private DropshippingManager $manager
    ) {}

    public function execute(string $categoryId): void
    {
        // Get category sync state
        // If not exists → start from page 1
        $category = Category::where('external_id', $categoryId)->first();

        $state = CategorySyncState::where('category_id', $category->id)->first();
        // $page = $state ? $state->page : 1;
        // for now use page 1
        $page = 1;

        // Call CJ product list API (paged) GET /products?categoryId=X&page=1&limit=100
        $provider = $this->manager->driver();
        $productsData = $provider->getProducts($categoryId, $page, 2);

        // \Log::info('productsData', $productsData);

        $nextPage = $productsData['pagination']['page'] + 1;

        // Update products (IMPORTANT: idempotent upsert)
        $now = now();
        $rows = array_map(function ($p) use ($now) {
            return [
                ...$p,
                'status' => 'discovered',
                'last_seen_at' => $now,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }, $productsData['products']);
        Product::upsert($rows, ['external_id'], ['name_raw', 'price', 'now_price', 'suggested_price', 'big_image', 'status', 'last_seen_at', 'raw_data']);

        // UPDATE CATEGORY (PIVOT)
        // Get existing products
        $products = Product::whereIn(
            'external_id',
            collect($rows)->pluck('external_id')
        )->get()->keyBy('external_id');

        // Generate pivot rows
        $pivotRows = [];
        foreach ($rows as $row) {
            $product = $products[$row['external_id']] ?? null;

            if (!$product) continue;

            $pivotRows[] = [
                'product_id' => $product->id,
                'category_id' => $category->id, // id from my category table
            ];
        }

        // Update pivot
        DB::transaction(function () use ($products, $pivotRows) {
            DB::table('category_product')
                ->whereIn('product_id', $products->pluck('id'))
                ->delete();
            
            DB::table('category_product')->upsert(
                $pivotRows,
                ['product_id', 'category_id']
            );
        });       


        // Mark product for later enrichment $product->needs_ai_processing = true; OR dispatch(new SyncProductDetailsJob($product->external_id));

        // Update pagination state
        // $state->page = $nextPage;
        // $state->last_run_at = now();       

        // Stop condition
        // Stop when:
        // API returns empty
        // OR less than 100 items
        
    }
}
