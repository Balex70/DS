<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductTranslation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductTranslation>
 */
class ProductTranslationFactory extends Factory
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
            'locale' => $this->faker->randomElement(['en', 'uk', 'de', 'pl', 'fr', 'es']),
            'name' => $this->faker->words(8, true),
            'description' => $this->faker->words(24, true),
            'translated_at' => now(),
        ];
    }
}
