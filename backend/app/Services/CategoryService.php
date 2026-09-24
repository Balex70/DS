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

    public function getChildrenSlugs(array $slugArray): array
    {
        $fullPath = implode('/', $slugArray);
        return Cache::remember(
            "category_children_slugs:$fullPath",
            now()->addDay(),
            function () use ($fullPath) {

                $category = Category::where('full_path', $fullPath)->first();

                if (!$category) {
                    return [];
                }

                $allCategories = Category::query()
                    ->select(['id', 'parent_id', 'slug'])
                    ->get();

                return $this->getChildrenRecursively($category, $allCategories);
            }
        );
    }

    public function recalculateCategoryVisibility() {
        $categories = Category::all()->keyBy('id');

        $children = [];

        foreach ($categories as $category) {
            $children[$category->parent_id][] = $category;
        }

        $this->updateChildren(
            $children,
            null,
            true
        );
    }

    private function updateChildren(array $children, ?int $parentId, bool $parentVisible): void
    {
        foreach ($children[$parentId] ?? [] as $category) {

            $visible = $parentVisible && $category->active;

            $category->update([
                'is_visible' => $visible,
            ]);

            $this->updateChildren(
                $children,
                $category->id,
                $visible
            );
        }
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
