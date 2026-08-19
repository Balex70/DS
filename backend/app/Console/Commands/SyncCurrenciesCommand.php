<?php

namespace App\Console\Commands;

use App\Jobs\SyncCurrenciesJob;
use App\Services\SettingService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

#[Signature('app:sync-currencies')]
#[Description('Sync currencies')]
class SyncCurrenciesCommand extends Command
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
        if (! $this->setting->get('currency_sync.allow_cron_sync')) {
            $this->info('Currencies sync is disabled.');
            Log::info('Currencies sync is disabled.');

            return self::SUCCESS;
        }

        SyncCurrenciesJob::dispatch();

        $this->info('Sync currencies job dispatched!');
        Log::info('Sync currencies job dispatched!');

        return self::SUCCESS;
    }
}
