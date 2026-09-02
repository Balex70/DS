<?php

namespace Database\Factories;

use App\Models\CjToken;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CjToken>
 */
class CjTokenFactory extends Factory
{
    protected $model = CjToken::class;

    public function definition(): array
    {
        return [
            'access_token' => $this->faker->uuid,
            'refresh_token' => $this->faker->uuid,
            'access_expires_at' => now()->addHour(),
            'refresh_expires_at' => now()->addDay(),
            'updated_at' => now(),
        ];
    }

    public function expired(): self
    {
        return $this->state([
            'access_expires_at' => now()->subHour(),
            'refresh_expires_at' => now()->subDay(),
        ]);
    }

    public function expiringSoon(): self
    {
        return $this->state([
            'access_expires_at' => now()->addMinutes(5),
        ]);
    }
}
