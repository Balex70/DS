<?php

namespace App\Console\Commands;

use App\Jobs\SyncCategoriesProductsJob;
use App\Services\SettingService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

#[Signature('app:sync-products')]
#[Description('Sync categories products from CJ (run one category per run)')]
class SyncCategoriesProductsCommand extends Command
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
        if (! $this->setting->get('product_sync.allow_cron_sync')) {
            $this->info('Product sync is disabled.');
            Log::info('Product sync is disabled.');

            return self::SUCCESS;
        }

        SyncCategoriesProductsJob::dispatch();

        $this->info('Sync categories products job dispatched!');

        return self::SUCCESS;
    }
}
