<?php

namespace Database\Factories;

use App\Models\CategorySyncState;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CategorySyncState>
 */
class CategorySyncStateFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'category_id' => fake()->randomNumber(5),
            'page' => 1,
            'finished' => false,
        ];
    }
}
