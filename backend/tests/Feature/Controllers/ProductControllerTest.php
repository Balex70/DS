<?php

namespace Tests\Feature\Controllers;

use App\Enums\ProductAiStatusEnum;
use App\Http\Controllers\Api\ProductController;
use App\Models\Product;
use App\Models\User;
use App\Services\ProductService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
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

        $this->superadmin = User::where(
            'email',
            env('SUPER_ADMIN_EMAIL', 'admin@mail.com')
        )->firstOrFail();
        $this->admin = User::factory()->admin()->create();
        $this->editor = User::factory()->editor()->create();
    }

    protected function actingAsAiWorker(): User
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user, [
            'ai:texts',
            'ai:images',
        ]);

        return $user;
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
                'price' => $product->price,
                'translations' => [
                    'en' => [
                        'name' => 'Updated',
                        'description' => $product->description_processed,
                    ],
                    'uk' => [
                        'name' => "Змінений",
                        'description' => 'Український опис',
                    ],
                ],
            ]);

        $response->assertOk()
            ->assertJsonFragment([
                'name_processed' => 'Updated',
            ])->assertJsonFragment([
                'locale' => 'uk',
                'name' => 'Змінений',
            ]);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name_processed' => 'Updated',
        ]);
        
        $this->assertDatabaseHas('product_translations', [
            'product_id' => $product->id,
            'locale' => 'uk',
            'name' => 'Змінений',
            'description' => 'Український опис',
        ]);
    }

    public function test_admin_can_update_product()
    {
        $product = Product::factory()->create([
            'name_processed' => 'Old',
        ]);

        $response = $this->actingAs($this->admin)
            ->putJson("/api/products/{$product->id}", [
                'price' => $product->price,
                'translations' => [
                    'en' => [
                        'name' => 'Updated',
                        'description' => $product->description_processed,
                    ],
                    'uk' => [
                        'name' => "Змінений",
                        'description' => 'Український опис',
                    ],
                ],
            ]);

        $response->assertOk()
            ->assertJsonFragment([
                'name_processed' => 'Updated',
            ])->assertJsonFragment([
                'locale' => 'uk',
                'name' => 'Змінений',
            ]);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name_processed' => 'Updated',
        ]);

        $this->assertDatabaseHas('product_translations', [
            'product_id' => $product->id,
            'locale' => 'uk',
            'name' => 'Змінений',
            'description' => 'Український опис',
        ]);
    }

    public function test_editor_can_update_product()
    {
        $product = Product::factory()->create();

        $response = $this->actingAs($this->editor)
            ->putJson("/api/products/{$product->id}", [
                'price' => $product->price,
                'translations' => [
                    'en' => [
                        'name' => 'Updated',
                        'description' => $product->description_processed,
                    ],
                    'uk' => [
                        'name' => "Змінений",
                        'description' => 'Український опис',
                    ],
                ],
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
        $this->actingAsAiWorker();

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
        $this->actingAsAiWorker();

        Product::factory()->create([
            'ai_status' => ProductAiStatusEnum::DONE,
        ]);

        $response = $this->getJson('/api/products/ai-texts/next');

        $response->assertNoContent();
    }

    public function test_ai_texts_next_fails_without_token()
    {
        $response = $this->getJson('/api/products/ai-texts/next');

        $response
            ->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }

    public function test_ai_texts_next_fails_with_invalid_token()
    {
        $response = $this
            ->withHeaders([
                'Authorization' => 'Bearer invalid-token-123',
            ])
            ->getJson('/api/products/ai-texts/next');

        $response
            ->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }

    public function test_ai_texts_next_fails_without_required_ability()
    {
        $user = User::factory()->create();

        $token = $user->createToken('test', ['ai:images'])->plainTextToken;

        $response = $this
            ->withHeaders([
                'Authorization' => "Bearer $token",
            ])
            ->getJson('/api/products/ai-texts/next');

        $response->assertStatus(403);
    }
    
    // AI TEXTS COMPLETE
    public function test_ai_texts_complete_updates_product()
    {
        $this->actingAsAiWorker();

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
    
    public function test_ai_texts_complete_fails_without_token()
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

        $response
            ->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }

    public function test_ai_texts_complete_fails_with_invalid_token()
    {
        $product = Product::factory()->create([
            'ai_status' => ProductAiStatusEnum::PROCESSING,
        ]);

        $response = $this
            ->withHeaders([
                'Authorization' => 'Bearer invalid-token-123',
            ])
            ->postJson(
                "/api/products/ai-texts/{$product->id}/complete",
                [
                    'title' => 'AI Title',
                    'description' => 'AI Description',
                ]
            );

        $response
            ->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }

    public function test_ai_texts_complete_fails_without_required_ability()
    {
        $user = User::factory()->create();

        // token WITHOUT ai:texts ability
        $token = $user->createToken('test', ['ai:images'])->plainTextToken;

        $product = Product::factory()->create([
            'ai_status' => ProductAiStatusEnum::PROCESSING,
        ]);

        $response = $this
            ->withHeaders([
                'Authorization' => "Bearer $token",
            ])
            ->postJson(
                "/api/products/ai-texts/{$product->id}/complete",
                [
                    'title' => 'AI Title',
                    'description' => 'AI Description',
                ]
            );

        $response->assertStatus(403);
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
