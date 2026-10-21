<?php

namespace App\Jobs;

use App\Dropshipping\Actions\EnrichProductAction;
use App\Services\SettingService;
use Illuminate\Bus\Queueable as BusQueueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class EnrichProductJob implements ShouldQueue
{
    use BusQueueable, InteractsWithQueue, Queueable, SerializesModels;
    public function handle(EnrichProductAction $action, SettingService $setting)
    {
        if (! $setting->get('product_sync.allow_cron_enrichment')) {
            return;
        }
        $action->execute();
    }
}
