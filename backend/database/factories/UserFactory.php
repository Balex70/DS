<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * State to create a Super Admin user.
     */
    public function superAdmin(): static
    {
        return $this->state(fn (array $attributes) => [
            // Matches your model's env() check for hardcoded admin safety
            'email' => env('SUPER_ADMIN_EMAIL', 'superadmin@example.com'),
            'name' => 'Super Admin',
        ])->afterCreating(function (User $user) {
            // Assign Spatie role if it exists in your database
            $user->assignRole('admin');
        });
    }

    /**
     * State to create a standard Admin user.
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'email' => fake()->unique()->safeEmail(),
        ])->afterCreating(function (User $user) {
            // Assign Spatie role if it exists in your database
            $user->assignRole('admin');
        });
    }

    /**
     * State to create a editor user.
     */
    public function editor(): static
    {
        return $this->state(fn (array $attributes) => [
            'email' => fake()->unique()->safeEmail(),
        ])->afterCreating(function (User $user) {
            // Assign Spatie role if it exists in your database
            $user->assignRole('editor');
        });
    }
}
