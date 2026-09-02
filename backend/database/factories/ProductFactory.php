<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->words(3, true);

        return [
            'external_id' => (string) Str::uuid(),

            'name_raw' => $name,
            'name_processed' => $name,
            'slug' => Str::slug($name),

            'description_raw' => $this->faker->paragraph(),
            'description_processed' => $this->faker->paragraph(),

            'cost_price' => $this->faker->numberBetween(1000, 50000),
            'price' => $this->faker->numberBetween(1000, 50000),
            'now_price' => $this->faker->numberBetween(1000, 50000),
            'suggested_price' => $this->faker->numberBetween(1000, 50000),

            'sku' => $this->faker->unique()->bothify('CJ####??'),

            'is_collect' => false,
            'add_mark_status' => false,

            'warehouse_inventory_num' => $this->faker->numberBetween(0, 1000),

            'raw_data' => [],

            'last_enrichment_at' => null,
            'ai_images_at' => null,
            'ai_texts_at' => null,

            'ai_status' => null,
        ];
    }
}
