<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<ProductVariant>
 */
class ProductVariantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),

            'external_id' => (string) Str::uuid(),
            'sku' => $this->faker->unique()->bothify('CJ####??'),
            'name' => $this->faker->words(3, true),
            'key' => $this->faker->unique()->bothify('variant-####'),

            'cost_price' => $this->faker->numberBetween(1000, 50000),
            'price' => $this->faker->numberBetween(1000, 50000),

            'stock' => $this->faker->numberBetween(0, 1000),

            'weight' => $this->faker->randomFloat(3, 0.1, 10),
            'volume' => $this->faker->randomFloat(3, 0.001, 1),

            'image_id' => null,

            'name_processed' => null,
            'ai_status' => null,
        ];
    }
}
