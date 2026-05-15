<?php

namespace Tests\Feature\Commands;

use Illuminate\Support\Facades\Queue;
use App\Jobs\SyncCategoriesJob;
use Tests\TestCase;

class SyncCategoriesCommandTest extends TestCase
{
    public function test_dispatches_sync_categories_job()
    {
        Queue::fake();

        $this->artisan('app:sync-categories')
            ->assertExitCode(0);

        Queue::assertPushed(SyncCategoriesJob::class, function ($job) {
            return true; // no args in this job
        });
    }
}
