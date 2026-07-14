<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // reset cache
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // permissions
        Permission::firstOrCreate(['name' => 'users.edit']);
        Permission::firstOrCreate(['name' => 'users.delete']);
        Permission::firstOrCreate(['name' => 'customers.edit']);
        Permission::firstOrCreate(['name' => 'customers.delete']);
        Permission::firstOrCreate(['name' => 'categories.edit']);
        Permission::firstOrCreate(['name' => 'categories.delete']);
        Permission::firstOrCreate(['name' => 'products.edit']);
        Permission::firstOrCreate(['name' => 'products.delete']);
        Permission::firstOrCreate(['name' => 'orders.edit']);
        Permission::firstOrCreate(['name' => 'orders.delete']);
        Permission::firstOrCreate(['name' => 'payments.edit']);
        Permission::firstOrCreate(['name' => 'payments.delete']);
        Permission::firstOrCreate(['name' => 'materials.edit']);
        Permission::firstOrCreate(['name' => 'materials.delete']);
        Permission::firstOrCreate(['name' => 'view dashboard']);

        // roles
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $editor = Role::firstOrCreate(['name' => 'editor']);

        // assign permissions
        $admin->givePermissionTo(Permission::all());

        $editor->givePermissionTo([
            'categories.edit',
            'products.edit',
            'view dashboard',
        ]);
    }
}
