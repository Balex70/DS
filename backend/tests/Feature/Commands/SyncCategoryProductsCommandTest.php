<?php

namespace Tests\Feature\Commands;

use Illuminate\Support\Facades\Queue;
use App\Jobs\SyncCategoryProductsJob;
use Tests\TestCase;

class SyncCategoryProductsCommandTest extends TestCase
{
    public function test_dispatches_sync_category_products_job()
    {
        Queue::fake();

        $this->artisan('app:sync-category', [
            'categoryId' => 'cat-123',
        ])->assertExitCode(0);

        Queue::assertPushed(SyncCategoryProductsJob::class, function ($job) {
            return $job->categoryId === 'cat-123';
        });
    }
}
