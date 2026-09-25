<?php

namespace App\Console\Commands;

use App\Jobs\SubscribeProductsWebhooksJob;
use App\Services\SettingService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

#[Signature('app:subscribe-products-webhooks')]
#[Description('Subscribe products for webhooks (send products for subscription)')]
class SubscribeProductsWebhooksCommand extends Command
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
        if (! $this->setting->get('product_sync.allow_cron_subscription')) {
            $this->info('Product subscription is disabled in cron.');
            Log::info('Product subscription is disabled in cron.');

            return self::SUCCESS;
        }

        SubscribeProductsWebhooksJob::dispatch();

        $this->info('Product subscription job dispatched!');
        Log::info('Product subscription job dispatched!');

        return self::SUCCESS;
    }
}
