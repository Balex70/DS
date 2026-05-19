<?php

namespace Tests\Feature\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use App\Services\ProductImageService;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class AiImagesControllerTest extends TestCase
{
    public function test_next_returns_queued_image_and_marks_processing()
    {
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
        $response = $this->getJson('/api/products/ai-images/next');

        $response->assertNoContent();
    }
    
    public function test_complete_updates_image_and_product()
    {
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
}
