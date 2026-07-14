<?php

namespace Database\Factories;

use App\Models\ProductVariant;
use App\Models\ProductVariantTranslation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductVariantTranslation>
 */
class ProductVariantTranslationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_variant_id' => ProductVariant::factory(),
            'locale' => $this->faker->randomElement(['en', 'uk', 'de', 'pl', 'fr', 'es']),
            'name' => $this->faker->words(5, true),
            'translated_at' => now(),
        ];
    }
}
