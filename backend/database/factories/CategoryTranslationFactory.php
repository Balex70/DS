<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\CategoryTranslation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CategoryTranslation>
 */
class CategoryTranslationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'category_id' => Category::factory(),
            'locale' => $this->faker->randomElement(['en', 'uk', 'de', 'pl', 'fr', 'es']),
            'name' => $this->faker->words(5, true),
            'description' => $this->faker->words(224, true),
            'translated_at' => now(),
        ];
    }
}
