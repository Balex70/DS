<?php

namespace App\Dropshipping\Actions;

use App\Dropshipping\DropshippingManager;
use App\Models\Category;
use App\Models\CategorySyncState;
use App\Models\Product;
use App\Services\SettingService;
use Illuminate\Support\Facades\DB;

class SyncCategoryProductsAction
{
    public function __construct(
        private DropshippingManager $manager,
        private SettingService $setting
    ) {}

    public function execute(string $categoryId): void
    {
        // Get category
        $category = Category::where('external_id', $categoryId)->first();

        // Get category sync state. If not exists, start from page 1
        $state = CategorySyncState::firstOrCreate(
            ['category_id' => $category->id],
            [
                'page' => 1,
                'finished' => false,
            ]
        );

        // Stop condition if category is finished
        if ($state->finished) {
            return;
        }
        $page = $state->page;

        // Call CJ product list API
        $provider = $this->manager->driver();
        $productsData = $provider->getProducts($categoryId, $page, 20);

        // Update products (IMPORTANT: idempotent upsert)
        $now = now();
        $rows = array_map(function ($p) use ($now) {
            return [
                'external_id' => $p['external_id'],
                'name_raw' => $p['name_raw'],
                'sku' => $p['sku'],
                'description_raw' => $p['description_raw'],
                'price' => $p['price'],
                'now_price' => $p['now_price'],
                'suggested_price' => $p['suggested_price'],
                'is_collect' => $p['is_collect'],
                'add_mark_status' => $p['add_mark_status'],
                'warehouse_inventory_num' => $p['warehouse_inventory_num'],
                'raw_data' => $p['raw_data'],
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }, $productsData['products']);

        $totalPages = $productsData['pagination']['total_pages'];
        $isLastPage = $page >= $totalPages;
        DB::transaction(function () use ($rows, $state, $isLastPage, $page, $category, $now) {
            // Upsert products
            Product::upsert($rows, ['external_id'], ['name_raw', 'price', 'now_price', 'suggested_price', 'raw_data']);

            // Get existing (upserted) products
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

            // Upsert pivot
            DB::table('category_product')->upsert(
                $pivotRows,
                ['product_id', 'category_id']
            );

            // Update category sync state
            $state->update([
                'page' => $isLastPage ? $page : $page + 1,
                'finished' => ($isLastPage || $page >= $this->setting->get('product_sync.max_pages_allowed')) ? true : false,
                'last_run_at' => $now,
            ]);
        });
    }
}
