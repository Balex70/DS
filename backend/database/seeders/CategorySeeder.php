<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            ['name' => 'Closes'],
            ['name' => 'Jewelry'],
            ['name' => 'Car parts']
        ];
    
        foreach ($items as $item) {
            Category::create($item);
        }
    }
}
