<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        $email = config('admin.email');
        $password = config('admin.password');

        if (empty($email) || empty($password)) {
            throw new \RuntimeException(
                'SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD must be set before seeding the super admin.'
            );
        }

        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => 'Super Admin',
                'password' => $password, // Because your User model has 'password' => 'hashed',
            ]
        );

        $user->assignRole('admin');
    }
}
