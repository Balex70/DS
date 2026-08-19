<?php

namespace App\Console\Commands;

use App\Jobs\EnrichProductJob;
use App\Services\SettingService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

#[Signature('app:enrich-product')]
#[Description('Enrich product')]
class EnrichProductCommand extends Command
{
    public function __construct(
        private SettingService $setting
    ) {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if (! $this->setting->get('product_sync.allow_cron_enrichment')) {
            $this->info('Product enrichment is disabled.');
            Log::info('Product enrichment is disabled.');

            return self::SUCCESS;
        }

        EnrichProductJob::dispatch();

        $this->info('Enrich product job dispatched!');

        return self::SUCCESS;
    }
}
