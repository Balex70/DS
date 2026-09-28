<?php

namespace Tests\Feature\Dropshipping;

use App\Dropshipping\Actions\SyncCategoryProductsAction;
use App\Dropshipping\Contracts\DropshippingProviderInterface;
use App\Dropshipping\DropshippingManager;
use App\Models\Category;
use App\Models\CategorySyncState;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class SyncCategoryProductsActionTest extends TestCase
{
    use RefreshDatabase;

    public function test_creates_sync_state_if_not_exists()
    {
        $category = Category::factory()->create([
            'external_id' => 'cat-1',
        ]);

        $provider = $this->mock(DropshippingProviderInterface::class);

        $provider
            ->shouldReceive('getProducts')
            ->once()
            ->with('cat-1', 1, 20)
            ->andReturn([
                'products' => [],
                'pagination' => [
                    'total_pages' => 1,
                ],
            ]);

        $manager = $this->mock(DropshippingManager::class);
        $manager
            ->shouldReceive('driver')
            ->once()
            ->andReturn($provider);
            
        $manager = $this->app->instance(DropshippingManager::class, $manager);

        $action = $this->app->make(SyncCategoryProductsAction::class);

        $action->execute('cat-1');

        $this->assertDatabaseHas('category_sync_states', [
            'category_id' => $category->id,
            'page' => 1,
            'finished' => true,
        ]);
    }

    public function test_returns_early_when_sync_finished()
    {
        $category = Category::factory()->create([
            'external_id' => 'cat-1',
        ]);

        CategorySyncState::factory()->create([
            'category_id' => $category->id,
            'finished' => true,
        ]);

        $provider = $this->mock(DropshippingProviderInterface::class);

        $provider
            ->shouldNotReceive('getProducts');

        $manager = $this->mock(DropshippingManager::class);

        $manager
            ->shouldReceive('driver')
            ->never();

        $manager = $this->app->instance(DropshippingManager::class, $manager);
        $action = $this->app->make(SyncCategoryProductsAction::class);

        $action->execute('cat-1');
    }

    public function test_upserts_products()
    {
        $category = Category::factory()->create([
            'external_id' => 'cat-1',
        ]);

        $provider = $this->mock(DropshippingProviderInterface::class);

        $provider
            ->shouldReceive('getProducts')
            ->once()
            ->andReturn([
                'products' => [
                    [
                        'external_id' => 'prod-1',
                        'name_raw' => 'Product 1',
                        'sku' => 'CJ-TEST-001',
                        'description_raw' => 'Description 1',
                        'price' => 5000,
                        'now_price' => 4500,
                        'suggested_price' => 9000,
                        'raw_data' => '{}',
                        'is_collect' => false,
                        'add_mark_status' => false,
                        'warehouse_inventory_num' => 1275,
                    ],
                ],
                'pagination' => [
                    'total_pages' => 1,
                ],
            ]);

        $manager = $this->mock(DropshippingManager::class);

        $manager
            ->shouldReceive('driver')
            ->once()
            ->andReturn($provider);

        $manager = $this->app->instance(DropshippingManager::class, $manager);
        $action = $this->app->make(SyncCategoryProductsAction::class);

        $action->execute('cat-1');

        $this->assertDatabaseHas('products', [
            'external_id' => 'prod-1',
            'name_raw' => 'Product 1',
            'sku' => 'CJ-TEST-001',
            'cost_price' => 5000,
            'price' => 8050,
            'now_price' => 4500,
            'suggested_price' => 9000,
        ]);
    }

    public function test_upserts_existing_and_new_products(): void
    {
        $category = Category::factory()->create([
            'external_id' => 'cat-1',
        ]);

        // Existing products with intentionally wrong data.
        $existingProduct1 = Product::factory()->create([
            'external_id' => 'prod-1',
            'name_raw' => 'Old Product Name',
            'sku' => 'OLD-SKU',
            'cost_price' => 4000,
            'price' => 9999,
            'now_price' => 4000,
            'suggested_price' => 8000,
        ]);

        $existingProduct2 = Product::factory()->create([
            'external_id' => 'prod-2',
            'name_raw' => 'Old Product Name 2',
            'sku' => 'OLD-SKU-2',
            'cost_price' => null,
            'price' => null,
            'now_price' => null,
            'suggested_price' => null,
        ]);

        $provider = $this->mock(DropshippingProviderInterface::class);

        $provider
            ->shouldReceive('getProducts')
            ->once()
            ->andReturn([
                'products' => [
                    // Existing products
                    [
                        'external_id' => 'prod-1',
                        'name_raw' => 'Product 1',
                        'sku' => 'CJ-TEST-001',
                        'description_raw' => 'Description 1',
                        'price' => 5000,
                        'now_price' => 4500,
                        'suggested_price' => 9000,
                        'raw_data' => '{}',
                        'is_collect' => false,
                        'add_mark_status' => false,
                        'warehouse_inventory_num' => 1275,
                    ],
                    [
                        'external_id' => 'prod-2',
                        'name_raw' => 'Product 2',
                        'sku' => 'CJ-TEST-002',
                        'description_raw' => 'Description 2',
                        'price' => 5000,
                        'now_price' => 4500,
                        'suggested_price' => 9000,
                        'raw_data' => '{}',
                        'is_collect' => false,
                        'add_mark_status' => false,
                        'warehouse_inventory_num' => 1275,
                    ],

                    // New product
                    [
                        'external_id' => 'prod-3',
                        'name_raw' => 'Product 3',
                        'sku' => 'CJ-TEST-003',
                        'description_raw' => 'Description 3',
                        'price' => 10000,
                        'now_price' => 9500,
                        'suggested_price' => 15000,
                        'raw_data' => '{}',
                        'is_collect' => false,
                        'add_mark_status' => false,
                        'warehouse_inventory_num' => 500,
                    ],
                ],
                'pagination' => [
                    'total_pages' => 1,
                ],
            ]);

        $manager = $this->mock(DropshippingManager::class);

        $manager
            ->shouldReceive('driver')
            ->once()
            ->andReturn($provider);

        $this->app->instance(DropshippingManager::class, $manager);

        $action = $this->app->make(SyncCategoryProductsAction::class);

        $action->execute('cat-1');

        // Existing products were updated, not duplicated.
        $this->assertDatabaseHas('products', [
            'id' => $existingProduct1->id,
            'external_id' => 'prod-1',
            'name_raw' => 'Product 1',
            'sku' => 'CJ-TEST-001',
            'cost_price' => 5000,
            'price' => 8050,
            'now_price' => 4500,
            'suggested_price' => 9000,
        ]);
        $this->assertDatabaseHas('products', [
            'id' => $existingProduct2->id,
            'external_id' => 'prod-2',
            'name_raw' => 'Product 2',
            'sku' => 'CJ-TEST-002',
            'cost_price' => 5000,
            'price' => 8050,
            'now_price' => 4500,
            'suggested_price' => 9000,
        ]);

        // New product was inserted with the calculated price.
        $this->assertDatabaseHas('products', [
            'external_id' => 'prod-3',
            'name_raw' => 'Product 3',
            'sku' => 'CJ-TEST-003',
            'cost_price' => 10000,
            'price' => 15100,
            'now_price' => 9500,
            'suggested_price' => 15000,
        ]);

        // Make sure the existing product wasn't duplicated.
        $this->assertDatabaseCount('products', 3);
    }

    public function test_creates_category_product_pivot()
    {
        $category = Category::factory()->create([
            'external_id' => 'cat-1',
        ]);

        $provider = $this->mock(DropshippingProviderInterface::class);

        $provider
            ->shouldReceive('getProducts')
            ->once()
            ->andReturn([
                'products' => [
                    [
                        'external_id' => 'prod-1',
                        'name_raw' => 'Product 1',
                        'sku' => 'CJ-TEST-001',
                        'description_raw' => 'Description 1',
                        'price' => 1000,
                        'now_price' => 800,
                        'suggested_price' => 1200,
                        'raw_data' => '{}',
                        'is_collect' => false,
                        'add_mark_status' => false,
                        'warehouse_inventory_num' => 1275,
                    ],
                ],
                'pagination' => [
                    'total_pages' => 1,
                ],
            ]);

        $manager = $this->mock(DropshippingManager::class);

        $manager
            ->shouldReceive('driver')
            ->andReturn($provider);

        $manager = $this->app->instance(DropshippingManager::class, $manager);
        $action = $this->app->make(SyncCategoryProductsAction::class);

        $action->execute('cat-1');

        $product = Product::first();

        $this->assertDatabaseHas('category_product', [
            'product_id' => $product->id,
            'category_id' => $category->id,
        ]);
    }

    public function test_updates_sync_state_to_next_page()
    {
        $category = Category::factory()->create([
            'external_id' => 'cat-1',
        ]);

        CategorySyncState::factory()->create([
            'category_id' => $category->id,
            'page' => 1,
            'finished' => false,
        ]);

        $provider = $this->mock(DropshippingProviderInterface::class);

        $provider
            ->shouldReceive('getProducts')
            ->once()
            ->andReturn([
                'products' => [],
                'pagination' => [
                    'total_pages' => 3,
                ],
            ]);

        $manager = $this->mock(DropshippingManager::class);

        $manager
            ->shouldReceive('driver')
            ->andReturn($provider);

        $manager = $this->app->instance(DropshippingManager::class, $manager);
        $action = $this->app->make(SyncCategoryProductsAction::class);

        $action->execute('cat-1');

        $this->assertDatabaseHas('category_sync_states', [
            'category_id' => $category->id,
            'page' => 2,
            'finished' => false,
        ]);
    }

    public function test_marks_sync_finished_on_last_page()
    {
        $category = Category::factory()->create([
            'external_id' => 'cat-1',
        ]);

        CategorySyncState::factory()->create([
            'category_id' => $category->id,
            'page' => 3,
            'finished' => false,
        ]);

        $provider = $this->mock(DropshippingProviderInterface::class);

        $provider
            ->shouldReceive('getProducts')
            ->once()
            ->andReturn([
                'products' => [],
                'pagination' => [
                    'total_pages' => 3,
                ],
            ]);

        $manager = $this->mock(DropshippingManager::class);

        $manager
            ->shouldReceive('driver')
            ->andReturn($provider);

        $manager = $this->app->instance(DropshippingManager::class, $manager);
        $action = $this->app->make(SyncCategoryProductsAction::class);

        $action->execute('cat-1');

        $this->assertDatabaseHas('category_sync_states', [
            'category_id' => $category->id,
            'page' => 3,
            'finished' => true,
        ]);
    }
    
    public function test_transaction_is_rolled_back_on_failure()
    {
        $category = Category::factory()->create([
            'external_id' => 'cat-1',
            'name' => 'Test Category',
        ]);

        CategorySyncState::factory()->create([
            'category_id' => $category->id,
            'page' => 1,
            'finished' => false,
        ]);

        $provider = $this->mock(DropshippingProviderInterface::class);

        $provider->shouldReceive('getProducts')
            ->once()
            ->andReturn([
                'products' => [
                    [
                        'external_id' => 'prod-1',
                        'name_raw' => 'Product 1',
                        'sku' => 'CJ-TEST-001',
                        'description_raw' => 'Description 1',
                        'price' => 1000,
                        'now_price' => 800,
                        'suggested_price' => 1200,
                        'raw_data' => [],
                        'is_collect' => false,
                        'add_mark_status' => false,
                        'warehouse_inventory_num' => 1275,
                    ]
                ],
                'pagination' => [
                    'total_pages' => 2,
                ],
            ]);

        $manager = $this->mock(DropshippingManager::class);

        $manager->shouldReceive('driver')
            ->andReturn($provider);

        // force failure AFTER some DB work starts
        Product::saving(function () {
            throw new \Exception('Boom');
        });

        $action = $this->app->make(SyncCategoryProductsAction::class);

        try {
            $action->execute('cat-1');
        } catch (\Exception $e) {
            // expected
        }

        // ASSERT: nothing was persisted

        $this->assertDatabaseMissing('products', [
            'external_id' => 'prod-1',
        ]);

        $this->assertDatabaseHas('category_sync_states', [
            'category_id' => $category->id,
            'page' => 1,
            'finished' => false,
        ]);
    }
}
