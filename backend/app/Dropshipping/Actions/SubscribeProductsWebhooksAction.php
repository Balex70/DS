<?php

namespace App\Dropshipping\Actions;

use App\Actions\CreateAppLogAction;
use App\Dropshipping\DropshippingManager;
use App\Enums\AppLogLevelEnum;
use App\Enums\AppLogRealmEnum;
use App\Enums\ProductWebhookStatusEnum;
use App\Models\Product;


class SubscribeProductsWebhooksAction
{
    public function __construct(
        private DropshippingManager $manager,
        private CreateAppLogAction $createAppLogAction
    ) {}

    public function execute(): void
    {
        $provider = $this->manager->driver();
        $providerName = $provider->getName();

        $this->createAppLogAction->execute(
            AppLogLevelEnum::INFO,
            AppLogRealmEnum::PRODUCT,
            "Send products for subscription started for provider [{$providerName}]."
        );

        $alreadySubscribedCount = Product::where('webhook_subscribed_status', ProductWebhookStatusEnum::SUCCESS)->count();

        if ($alreadySubscribedCount >= 1000) {
            $this->createAppLogAction->execute(
                AppLogLevelEnum::INFO,
                AppLogRealmEnum::PRODUCT,
                "Max products subscription reached for provider [{$providerName}]."
            );
            return;
        }

        // get products to send
        $productsToSend = Product::
            whereNotNull('last_enrichment_at')
            ->whereNull('enrichment_failed_at')
            ->whereNull('webhook_subscribed_status')
            ->orderBy('id')->limit(100)->get();

        if ($productsToSend->count() === 0) {
            return;
        }

        $res = $provider->subscribeProductsWebhooks($productsToSend->pluck('external_id')->toArray());
        
        // Error
        if (!$res['success']) {
            $this->createAppLogAction->execute(
                AppLogLevelEnum::ERROR,
                AppLogRealmEnum::PRODUCT,
                "Subscribe products webhooks failed for provider [{$providerName}].
Error: " . json_encode($res['message'])
            );

            return;
        }

        // Success
        $data = $res['data'] ?? [];
        $successProductIds = $data['successProductIds'] ?? [];
        $failProductIds = $data['failProductIds'] ?? [];

        if ($successProductIds) {
            Product::query()
                ->whereIn('external_id', $successProductIds)
                ->update([
                    'webhook_subscribed_status' => ProductWebhookStatusEnum::SUCCESS,
                ]);
        }

        if ($failProductIds) {
            Product::query()
                ->whereIn('external_id', $failProductIds)
                ->update([
                    'webhook_subscribed_status' => ProductWebhookStatusEnum::RECHECK,
                ]);
        }

        $this->createAppLogAction->execute(
            AppLogLevelEnum::INFO,
            AppLogRealmEnum::PRODUCT,
            "Products webhook subscription finished for provider [{$providerName}].
Success: " . count($successProductIds) . "
Need recheck: " . count($failProductIds)
        );
    }
}
