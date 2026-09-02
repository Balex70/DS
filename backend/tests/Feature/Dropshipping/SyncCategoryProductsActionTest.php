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
            ->once()
            ->andReturn($provider);

        $manager = $this->app->instance(DropshippingManager::class, $manager);
        $action = $this->app->make(SyncCategoryProductsAction::class);

        $action->execute('cat-1');

        $this->assertDatabaseHas('products', [
            'external_id' => 'prod-1',
            'name_raw' => 'Product 1',
        ]);
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
