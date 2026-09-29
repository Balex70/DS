<?php

namespace App\Console\Commands;

use App\Dropshipping\Actions\RetryOrDeleteFailedProductEnrichmentAction;
use App\Services\SettingService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

#[Signature('app:retry-enrich-failed-product')]
#[Description('Retry enrich failed product, delete product that remain failed and have no orders')]
class RetryOrDeleteFailedProductEnrichmentCommand extends Command
{
    public function __construct(
        private SettingService $setting
    ) {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle(RetryOrDeleteFailedProductEnrichmentAction $retryAction): int
    {
        if (! $this->setting->get('product_sync.allow_cron_retry_enrichment')) {
            $this->info('Retry enrich failed product is disabled.');
            Log::info('Retry enrich failed product is disabled.');

            return self::SUCCESS;
        }

        $retryAction->execute();
        return self::SUCCESS;
    }
}
