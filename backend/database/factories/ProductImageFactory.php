<?php

namespace Database\Factories;

use App\Models\ProductImage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductImage>
 */
class ProductImageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => \App\Models\Product::factory(), // Assumes a Product model exists
            'url' => $this->faker->imageUrl(640, 480, 'products'),
            'position' => $this->faker->numberBetween(0, 10),
            'created_at' => now(),
            'updated_at' => now(),
            'original_url' => $this->faker->imageUrl(1024, 1024, 'products'),
            'ai_url' => null, // Default to null until processed
            'status' => 'original',
            'ai_meta' => null,
            'ai_processed_at' => null,
        ];
    }
}
