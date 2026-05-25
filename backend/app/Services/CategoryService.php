<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Support\Facades\Cache;

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

    public function getChildrenSlugs(string $slug): array
    {
        return Cache::remember(
            "category_children_slugs:$slug",
            now()->addDay(),
            function () use ($slug) {

                $category = Category::where('slug', $slug)->first();

                if (!$category) {
                    return [];
                }

                $allCategories = Category::all();

                return $this->getChildrenRecursively($category, $allCategories);
            }
        );
    }

    private function getChildrenRecursively(Category $category, $allCategories): array
    {
        $slugs = [$category->slug];

        $children = $allCategories->where('parent_id', $category->id);

        foreach ($children as $child) {
            $slugs = array_merge(
                $slugs,
                $this->getChildrenRecursively($child, $allCategories)
            );
        }

        return $slugs;
    }
}
