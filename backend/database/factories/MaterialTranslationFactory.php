<?php

namespace Database\Factories;

use App\Models\Material;
use App\Models\MaterialTranslation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MaterialTranslation>
 */
class MaterialTranslationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'material_id' => Material::factory(),
            'locale' => $this->faker->randomElement(['en', 'uk', 'de', 'pl', 'fr', 'es']),
            'name' => $this->faker->words(5, true),
            'translated_at' => now(),
        ];
    }
}
