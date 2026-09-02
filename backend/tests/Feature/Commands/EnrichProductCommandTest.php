<?php

namespace Tests\Feature\Commands;

use App\Jobs\EnrichProductJob;
use App\Services\SettingService;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class EnrichProductCommandTest extends TestCase
{
    public function test_dispatches_enrich_product_job_when_enabled()
    {
        Queue::fake();

        app(SettingService::class)->set(
            'product_sync.allow_cron_enrichment',
            true
        );

        $this->artisan('app:enrich-product')
            ->assertExitCode(0);

        Queue::assertPushed(EnrichProductJob::class);
    }

    public function test_does_not_dispatch_enrich_product_job_when_disabled()
    {
        Queue::fake();

        app(SettingService::class)->set(
            'product_sync.allow_cron_enrichment',
            false
        );

        $this->artisan('app:enrich-product')
            ->assertExitCode(0);

        Queue::assertNotPushed(EnrichProductJob::class);
    }
}
