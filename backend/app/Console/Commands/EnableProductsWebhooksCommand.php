<?php

namespace App\Console\Commands;

use App\Dropshipping\DropshippingManager;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

#[Signature('app:enable-products-webhooks')]
#[Description('Enable products webhooks')]
class EnableProductsWebhooksCommand extends Command
{
    public function __construct(
        private DropshippingManager $manager,
    ) {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $provider = $this->manager->driver();
        $res = $provider->setProductsWebhooks("ENABLE");
        if (!$res['success']) {
            $message = 'Enable products webhooks failed for provider: ' . $provider->getName();

            $this->error($message);
            Log::error($message, ['response' => $res]);

            return self::FAILURE;
        }

        $this->info('Set products webhooks successfully for provider: ' . $provider->getName() . '.');
        Log::info('Set products webhooks successfully for provider: ' . $provider->getName() . '.');
        return self::SUCCESS;
    }
}
