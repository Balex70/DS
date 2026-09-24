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

    public function getCategoryAndChildrenIds(array $slugArray): array
    {
        $fullPath = implode('/', $slugArray);
        return Cache::remember(
            "category_all_children_ids:$fullPath",
            now()->addDay(),
            function () use ($fullPath) {

                $category = Category::where('full_path', $fullPath)->first();

                if (!$category) {
                    return [];
                }

                $allCategories = Category::query()
                    ->select(['id', 'parent_id', 'slug', 'is_visible'])
                    ->where('is_visible', true)
                    ->get();

                return $this->getChildrenIds($category, $allCategories);
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

    private function getChildrenIds(Category $category, $allCategories): array
    {
        $ids = [$category->id];

        $children = $allCategories
                    ->where('parent_id', $category->id)
                    ->where('is_visible', true);

        foreach ($children as $child) {
            $ids = array_merge(
                $ids,
                $this->getChildrenIds($child, $allCategories)
            );
        }

        return $ids;
    }
}
