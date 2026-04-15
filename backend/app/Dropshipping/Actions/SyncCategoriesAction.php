<?php

namespace App\Dropshipping\Actions;

use App\Dropshipping\DTO\CategoryDTO;
use App\Dropshipping\Services\DropshippingManager;
use App\Models\Category;

class SyncCategoriesAction
{
    public function __construct(
        private DropshippingManager $manager
    ) {}

    public function execute(): void
    {
        $provider = $this->manager->driver();

        $treeCategories = $provider->getCategories();

        $flatCategories = [];

        foreach ($treeCategories as $category) {
            $flatCategories = array_merge(
                $flatCategories,
                $category->flatten()
            );
        }

        // external_id => id
        $existing = Category::pluck('id', 'external_id')->toArray();

        foreach ($flatCategories as $category) {
            $model = Category::updateOrCreate(
                ['external_id' => $category->id],
                [
                    'name' => $category->name,
                    'parent_id' => $existing[$category->parentId] ?? null,
                ]
            );

            // update mapping after insert
            $existing[$category->id] = $model->id;
        }
    }

    private function resolveParentId(?string $externalParentId): ?int
    {
        if (!$externalParentId) {
            return null;
        }

        return Category::where('external_id', $externalParentId)->value('id');
    }
}
