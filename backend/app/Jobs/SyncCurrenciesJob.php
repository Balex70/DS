<?php

namespace App\Jobs;

use App\Currency\Actions\SyncCurrenciesAction;
use App\Services\SettingService;
use Illuminate\Bus\Queueable as BusQueueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SyncCurrenciesJob implements ShouldQueue
{
    use BusQueueable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public function handle(SyncCurrenciesAction $action, SettingService $setting)
    {
        if (! $setting->get('currency_sync.allow_cron_sync')) {
            return;
        }
        $action->execute();
    }
}
