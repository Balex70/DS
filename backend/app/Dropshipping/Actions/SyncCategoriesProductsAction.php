<?php

namespace App\Dropshipping\Actions;

use App\Jobs\SyncCategoryProductsJob;
use App\Models\Category;
use App\Models\CategorySyncState;

class SyncCategoriesProductsAction
{
    public function execute(): void
    {
        $category = Category::query()
            ->where('is_visible', true)
            ->where(function ($query) {
                // Category is currently being synchronized.
                // Continue it first.
                $query->whereHas('syncState', function ($query) {
                    $query->where('finished', false);
                })

                // OR category has never been synchronized.
                ->orWhereDoesntHave('syncState')

                // OR previous sync is old enough.
                ->orWhereHas('syncState', function ($query) {
                    $query
                        ->where('finished', true)
                        ->where(
                            'last_run_at',
                            '<=',
                            now()->subHours(24)
                        );
                });
            })
            ->orderBy('id')
            ->first();

        if (!$category) {
            \Log::info('no categories to sync');
            return;
        }

        $state = CategorySyncState::firstOrCreate(
            ['category_id' => $category->id],
            [
                'page' => 1,
                'finished' => false,
            ]
        );

        SyncCategoryProductsJob::dispatch(
            $category->external_id
        );

        \Log::info("Category sync dispatched: {$category->external_id}");
    }
}
