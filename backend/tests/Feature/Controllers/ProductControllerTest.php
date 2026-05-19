<?php

namespace Tests\Feature\Controllers;

use App\Enums\ProductAiStatusEnum;
use App\Http\Controllers\Api\ProductController;
use App\Models\Product;
use App\Models\User;
use App\Policies\ProductPolicy;
use App\Services\ProductService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use PHPUnit\Framework\Attributes\DataProvider;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ProductControllerTest extends TestCase
{
    use RefreshDatabase;
    
    protected User $superadmin;
    protected User $admin;
    protected User $editor;

    protected function setUp(): void
    {
        parent::setUp();

        Permission::firstOrCreate(['name' => 'products.edit']);
        Permission::firstOrCreate(['name' => 'products.delete']);
        
        // roles
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $editorRole = Role::firstOrCreate(['name' => 'editor']);

        // assign permissions
        $adminRole->givePermissionTo(Permission::all());

        $editorRole->givePermissionTo([
            'products.edit',
        ]);
        
        $this->superadmin = User::factory()->superAdmin()->create();
        $this->admin = User::factory()->admin()->create();
        $this->editor = User::factory()->editor()->create();
    }

    // INDEX TESTS
    public function test_superadmin_can_view_products()
    {
        Product::factory()->count(3)->create();

        $response = $this->actingAs($this->superadmin)
            ->getJson('/api/products');

        $response
            ->assertOk()
            ->assertJsonCount(3, 'data');
    }

    public function test_admin_can_view_products()
    {
        Product::factory()->count(3)->create();

        $response = $this->actingAs($this->admin)
            ->getJson('/api/products');

        $response
            ->assertOk()
            ->assertJsonCount(3, 'data');
    }

    public function test_editor_can_view_products()
    {
        Product::factory()->count(2)->create();

        $response = $this->actingAs($this->editor)
            ->getJson('/api/products');

        $response->assertOk();
    }

    public function test_guest_cannot_view_products()
    {
        $response = $this->getJson('/api/products');

        $response->assertUnauthorized();
    }
    
    // UPDATE TESTS
    public function test_superadmin_can_update_product()
    {
        $product = Product::factory()->create([
            'name_processed' => 'Old',
        ]);

        $response = $this->actingAs($this->superadmin)
            ->putJson("/api/products/{$product->id}", [
                'name_processed' => 'New Name',
            ]);

        $response->assertOk();

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name_processed' => 'New Name',
        ]);
    }

    public function test_admin_can_update_product()
    {
        $product = Product::factory()->create([
            'name_processed' => 'Old',
        ]);

        $response = $this->actingAs($this->admin)
            ->putJson("/api/products/{$product->id}", [
                'name_processed' => 'New Name',
            ]);

        $response->assertOk();

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name_processed' => 'New Name',
        ]);
    }

    public function test_editor_can_update_product()
    {
        $product = Product::factory()->create();

        $response = $this->actingAs($this->editor)
            ->putJson("/api/products/{$product->id}", [
                'name_processed' => 'Updated',
            ]);

        $response->assertOk();
    }

    public function test_user_without_permission_cannot_update_product()
    {
        $user = User::factory()->create();

        $product = Product::factory()->create();

        $response = $this->actingAs($user)
            ->putJson("/api/products/{$product->id}", [
                'name_processed' => 'Updated',
            ]);

        $response->assertForbidden();
    }
    
    // DELETE TESTS
    public function test_superadmin_can_delete_product()
    {
        $product = Product::factory()->create();

        $response = $this->actingAs($this->superadmin)
            ->deleteJson("/api/products/{$product->id}");

        $response->assertNoContent();

        // $this->assertSoftDeleted($product);
    }

    public function test_admin_cannot_delete_product()
    {
        $product = Product::factory()->create();

        $response = $this->actingAs($this->admin)
            ->deleteJson("/api/products/{$product->id}");

        $response->assertForbidden();
    }

    public function test_editor_cannot_delete_product()
    {
        $product = Product::factory()->create();

        $response = $this->actingAs($this->editor)
            ->deleteJson("/api/products/{$product->id}");

        $response->assertForbidden();
    }
    
    // ENRICH TESTS
    public function test_superadmin_can_enrich_product()
    {
        $product = Product::factory()->create();
        
        $productServiceMock = $this->mock(ProductService::class);
        $productServiceMock
            ->shouldReceive('enrichProduct')
            ->once()
            ->withArgs(function ($passedProduct) use ($product) {
                return $passedProduct->id === $product->id;
            });

        $this->app->instance(ProductService::class, $productServiceMock);
        $this->app->make(ProductController::class);

        $response = $this->actingAs($this->superadmin)
            ->patchJson("/api/products/enrich/{$product->id}");

        $response
            ->assertOk()
            ->assertJson([
                'message' => 'Product enriched',
            ]);
    }

    public function test_admin_can_enrich_product()
    {
        $product = Product::factory()->create();

        $productServiceMock = $this->mock(ProductService::class);
        $productServiceMock
            ->shouldReceive('enrichProduct')
            ->never();

        $this->app->instance(ProductService::class, $productServiceMock);
        $this->app->make(ProductController::class);

        $response = $this->actingAs($this->admin)
            ->patchJson("/api/products/enrich/{$product->id}");

        $response->assertForbidden();
    }

    public function test_editor_cannot_enrich_product()
    {
        $product = Product::factory()->create();

        $productServiceMock = $this->mock(ProductService::class);
        $productServiceMock
            ->shouldReceive('enrichProduct')
            ->never();

        $this->app->instance(ProductService::class, $productServiceMock);
        $this->app->make(ProductController::class);

        $response = $this->actingAs($this->editor)
            ->patchJson("/api/products/enrich/{$product->id}");

        $response->assertForbidden();
    }
    
    // AI TEXTS NEXT
    public function test_ai_texts_next_returns_next_queued_product()
    {
        Product::factory()->create([
            'ai_status' => ProductAiStatusEnum::DONE,
        ]);

        $queued = Product::factory()->create([
            'ai_status' => ProductAiStatusEnum::QUEUED,
            'last_enrichment_at' => now(),
        ]);

        $response = $this->getJson('/api/products/ai-texts/next');

        $response
            ->assertOk()
            ->assertJson([
                'id' => $queued->id,
            ]);

        $this->assertDatabaseHas('products', [
            'id' => $queued->id,
            'ai_status' => ProductAiStatusEnum::PROCESSING,
        ]);
    }

    public function test_ai_texts_next_returns_204_when_no_products()
    {
        Product::factory()->create([
            'ai_status' => ProductAiStatusEnum::DONE,
        ]);

        $response = $this->getJson('/api/products/ai-texts/next');

        $response->assertNoContent();
    }
    
    // AI TEXTS COMPLETE
    public function test_ai_texts_complete_updates_product()
    {
        $product = Product::factory()->create([
            'ai_status' => ProductAiStatusEnum::PROCESSING,
        ]);

        $response = $this->postJson(
            "/api/products/ai-texts/{$product->id}/complete",
            [
                'title' => 'AI Title',
                'description' => 'AI Description',
            ]
        );

        $response->assertOk();

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name_processed' => 'AI Title',
            'description_processed' => 'AI Description',
            'ai_status' => ProductAiStatusEnum::DONE,
        ]);
    }
    
    // FILTERS
    public function test_can_filter_enriched_products()
    {
        Product::factory()->create([
            'last_enrichment_at' => now(),
        ]);

        Product::factory()->create([
            'last_enrichment_at' => null,
        ]);

        $response = $this->actingAs($this->admin)
            ->getJson('/api/products?enriched=1');

        $response->assertJsonCount(1, 'data');
    }
}
