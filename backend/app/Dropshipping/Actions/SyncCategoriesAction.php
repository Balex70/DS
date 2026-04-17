<?php

namespace App\Dropshipping\Actions;

use App\Dropshipping\DropshippingManager;
use App\Models\Category;

class SyncCategoriesAction
{
    public function __construct(
        private DropshippingManager $manager
    ) {}

    public function execute(): void
    {
        $provider = $this->manager->driver();

        $categories = $provider->getCategories();

        // upsert categories
        foreach ($categories as $category) {
            Category::updateOrCreate(
                [
                    'external_id' => $category->externalId,
                    'provider' => $provider->getName(),
                ],
                [
                    'name' => $category->name,
                ]
            );
        }

        // build map
        $map = Category::where('provider', $provider->getName())
            ->pluck('id', 'external_id')
            ->toArray();

        // preload models
        $models = Category::where('provider', $provider->getName())
            ->get()
            ->keyBy('external_id');

        // assign parents
        foreach ($categories as $category) {
            if (!isset($models[$category->externalId])) {
                continue;
            }

            $models[$category->externalId]->update([
                'parent_id' => $category->parentId
                    ? ($map[$category->parentId] ?? null)
                    : null
            ]);
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
