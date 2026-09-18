<?php

namespace App\Dropshipping\Actions;

use App\Actions\CreateAppLogAction;
use App\Dropshipping\DropshippingManager;
use App\Enums\AppLogLevelEnum;
use App\Enums\AppLogRealmEnum;
use App\Models\Category;
use Illuminate\Support\Str;

class SyncCategoriesAction
{
    public function __construct(
        private DropshippingManager $manager,
        private CreateAppLogAction $createAppLogAction
    ) {}

    public function execute(): void
    {
        $provider = $this->manager->driver();
        $providerName = $provider->getName();

        $this->createAppLogAction->execute(
            AppLogLevelEnum::INFO,
            AppLogRealmEnum::CATEGORY,
            "Category sync started for provider [{$providerName}]."
        );

        try {
            $categories = $provider->getCategories();

            $createdIds = [];
            $updatedIds = [];
            $unchangedIds = [];
            // upsert categories
            foreach ($categories as $category) {
                $model = Category::updateOrCreate(
                    [
                        'external_id' => $category->externalId,
                        'provider' => $provider->getName(),
                    ],
                    [
                        'name' => $category->name,
                        'slug' => Str::slug($category->name),
                    ]
                );

                if ($model->wasRecentlyCreated) {
                    $createdIds[$model->id] = $model->name;
                } elseif ($model->wasChanged()) {
                    $updatedIds[$model->id] = $model->name;
                } else {
                    $unchangedIds[$model->id] = $model->name;
                }
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

            // Log
            $created = collect($createdIds)
                ->map(fn ($name, $id) => "{$id}: {$name}")
                ->implode(', ');
            $updated = collect($updatedIds)
                ->map(fn ($name, $id) => "{$id}: {$name}")
                ->implode(', ');
            $this->createAppLogAction->execute(
                AppLogLevelEnum::SUCCESS,
                AppLogRealmEnum::CATEGORY,
                "Category sync completed for provider [{$providerName}] | " . count($categories) . " categories processed.
Created: " . count($createdIds) . " (" . $created . ")
Updated: " . count($updatedIds) . " (" . $updated . ")
Unchanged: " . count($unchangedIds)
            );
        } catch (\Throwable $e) {
            $this->createAppLogAction->execute(
                AppLogLevelEnum::ERROR,
                AppLogRealmEnum::CATEGORY,
                "Category sync failed for provider [{$providerName}]: {$e->getMessage()}"
            );

            throw $e;
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
