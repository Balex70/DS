<?php

namespace App\Services;

use App\Models\Category;

class CategoryService
{
    public function syncFullPaths(): void
    {
        $categories = Category::with('parent')->get();

        foreach ($categories as $category) {
            $category->updateQuietly([
                'full_path' => $this->buildPath($category),
            ]);
        }
    }

    private function buildPath(Category $category): string
    {
        $slugs = [];

        while ($category) {
            $slugs[] = $category->slug;
            $category = $category->parent;
        }

        return implode('/', array_reverse($slugs));
    }
}
