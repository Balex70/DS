<?php

namespace Tests\Feature\Commands;

use App\Dropshipping\Actions\RetryOrDeleteFailedProductEnrichmentAction;
use App\Services\SettingService;
use Tests\TestCase;

class RetryOrDeleteFailedProductEnrichmentCommandTest extends TestCase
{
    public function test_retries_failed_product_when_enabled(): void
    {
        $this->mock(RetryOrDeleteFailedProductEnrichmentAction::class)
            ->shouldReceive('execute')
            ->once();

        app(SettingService::class)->set(
            'product_sync.allow_cron_retry_enrichment',
            true
        );

        $this->artisan('app:retry-enrich-failed-product')
            ->assertExitCode(0);
    }

    public function test_does_not_retry_failed_product_when_disabled(): void
    {
        $this->mock(RetryOrDeleteFailedProductEnrichmentAction::class)
            ->shouldReceive('execute')
            ->never();

        app(SettingService::class)->set(
            'product_sync.allow_cron_retry_enrichment',
            false
        );

        $this->artisan('app:retry-enrich-failed-product')
            ->assertExitCode(0);
    }
}
