<?php

namespace Tests\Feature\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\User;
use App\Services\ProductImageService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AiImagesControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function actingAsAiWorker(): User
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user, [
            'ai:texts',
            'ai:images',
        ]);

        return $user;
    }
    public function test_next_returns_queued_image_and_marks_processing()
    {
        $this->actingAsAiWorker();

        $product = Product::factory()->create([
            'name_raw' => 'Test product',
        ]);

        $image = ProductImage::factory()->create([
            'product_id' => $product->id,
            'status' => 'queued',
            'original_url' => 'images/test.jpg',
        ]);

        $response = $this->getJson('/api/products/ai-images/next');

        $response->assertOk()
            ->assertJson([
                'id' => $image->id,
                'product_id' => $product->id,
                'product_name' => 'Test product',
            ]);

        $this->assertDatabaseHas('product_images', [
            'id' => $image->id,
            'status' => 'processing',
        ]);
    }
    
    public function test_next_returns_204_when_no_images()
    {
        $this->actingAsAiWorker();

        $response = $this->getJson('/api/products/ai-images/next');

        $response->assertNoContent();
    }
    
    public function test_ai_images_next_fails_without_token()
    {
        $response = $this->getJson('/api/products/ai-images/next');

        $response
            ->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }

    public function test_ai_images_next_fails_without_required_ability()
    {
        $user = User::factory()->create();

        $token = $user->createToken('test', ['ai:texts'])->plainTextToken;

        $response = $this
            ->withHeaders([
                'Authorization' => "Bearer $token",
            ])
            ->getJson('/api/products/ai-images/next');

        $response->assertStatus(403);
    }
    public function test_ai_images_next_fails_with_invalid_token()
    {
        $response = $this
            ->withHeaders([
                'Authorization' => 'Bearer invalid-token-123',
            ])
            ->getJson('/api/products/ai-images/next');

        $response
            ->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }
    
    public function test_complete_updates_image_and_product()
    {
        $this->actingAsAiWorker();

        Storage::fake('public');

        $product = Product::factory()->create();

        $image = ProductImage::factory()->create([
            'product_id' => $product->id,
            'status' => 'processing',
            'ai_url' => null,
        ]);

        $service = $this->mock(ProductImageService::class);

        $service->shouldReceive('storeAiProcessed')
            ->once()
            ->andReturn('ai/path.jpg');

        $service->shouldReceive('delete')
            ->never();

        $file = UploadedFile::fake()->create('ai.jpg');

        $response = $this->postJson("/api/products/ai-images/{$image->id}/complete", [
            'image' => $file,
        ]);

        $response->assertOk();

        $this->assertDatabaseHas('product_images', [
            'id' => $image->id,
            'status' => 'done',
            'ai_url' => 'ai/path.jpg',
        ]);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
        ]);
    }
    
    public function test_sets_product_ai_images_at_when_all_images_done()
    {
        $this->actingAsAiWorker();

        $product = Product::factory()->create();

        $image = ProductImage::factory()->create([
            'product_id' => $product->id,
            'status' => 'processing',
        ]);

        $service = $this->mock(ProductImageService::class);

        $service->shouldReceive('storeAiProcessed')
            ->andReturn('ai.jpg');

        $file = UploadedFile::fake()->create('ai.jpg');

        $this->postJson("/api/products/ai-images/{$image->id}/complete", [
            'image' => $file,
        ]);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
        ]);

        $this->assertNotNull(
            Product::find($product->id)->ai_images_at
        );
    }

    public function test_ai_images_complete_fails_without_token()
    {
        $image = ProductImage::factory()->create([
            'status' => 'processing',
        ]);

        $response = $this->postJson(
            "/api/products/ai-images/{$image->id}/complete",
            [
                'image' => UploadedFile::fake()->create('result.jpg'),
            ]
        );

        $response
            ->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }

    public function test_ai_images_complete_fails_with_invalid_token()
    {
        $image = ProductImage::factory()->create([
            'status' => 'processing',
        ]);

        $response = $this
            ->withHeaders([
                'Authorization' => 'Bearer invalid-token-123',
            ])
            ->postJson(
                "/api/products/ai-images/{$image->id}/complete",
                [
                    'image' => UploadedFile::fake()->create('result.jpg'),
                ]
            );

        $response
            ->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }

    public function test_ai_images_complete_fails_without_required_ability()
    {
        $user = User::factory()->create();

        $token = $user->createToken('test', ['ai:texts'])->plainTextToken;

        $image = ProductImage::factory()->create([
            'status' => 'processing',
        ]);

        $response = $this
            ->withHeaders([
                'Authorization' => "Bearer $token",
            ])
            ->postJson(
                "/api/products/ai-images/{$image->id}/complete",
                [
                    'image' => UploadedFile::fake()->create('result.jpg'),
                ]
            );

        $response->assertStatus(403);
    }
}
