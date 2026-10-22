<?php

namespace App\Jobs;

use App\Dropshipping\Actions\SyncCategoriesProductsAction;
use App\Services\SettingService;
use Illuminate\Bus\Queueable as BusQueueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SyncCategoriesProductsJob implements ShouldQueue
{
    use BusQueueable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public function handle(SyncCategoriesProductsAction $action, SettingService $setting)
    {
        if (! $setting->get('product_sync.allow_cron_sync')) {
            return;
        }
        $action->execute();
    }
}
