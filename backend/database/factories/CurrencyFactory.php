<?php

namespace Database\Factories;

use App\Models\Currency;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Currency>
 */
class CurrencyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'from_currency' => $this->faker->currencyCode(),
            'to_currency' => $this->faker->currencyCode(),
            'rate' => $this->faker->randomNumber(6),
            'rate_updated_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
