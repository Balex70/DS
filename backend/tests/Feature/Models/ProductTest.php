<?php

namespace Tests\Feature\Models;

use App\Models\Product;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_deleting_product_removes_product_images_from_storage(): void
    {
        Storage::fake('public');

        $product = Product::factory()->create();

        $path = "products/{$product->id}/original/test.jpg";

        Storage::disk('public')->put($path, 'test');

        $product->delete();

        $this->assertFalse(
            Storage::disk('public')->exists($path)
        );
    }
}
