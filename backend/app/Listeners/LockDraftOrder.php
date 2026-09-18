<?php

namespace App\Listeners;

use App\Actions\CreateAppLogAction;
use App\Enums\AppLogLevelEnum;
use App\Enums\AppLogRealmEnum;
use App\Enums\OrderStatusEnum;
use App\Enums\PaymentStatusEnum;
use App\Events\PaymentInitiated;

class LockDraftOrder
{
    /**
     * Create the event listener.
     */
    public function __construct(private CreateAppLogAction $createAppLogAction)
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(PaymentInitiated $event): void
    {
        $order = $event->order->fresh();
        try {
            // Lock the order by changing it from DRAFT to CREATED
            if ($order->status === OrderStatusEnum::DRAFT) {
                $order->update([
                    'status' => OrderStatusEnum::CREATED,
                    'payment_status' => PaymentStatusEnum::PENDING
                ]);

                $this->createAppLogAction->execute(
                    AppLogLevelEnum::SUCCESS,
                    AppLogRealmEnum::ORDER,
                    "Order (ID: {$order->id}) moved from DRAFT to CREATED, payment status changed to PENDING"
                );
            }
        } catch (\Throwable $e) {
            $this->createAppLogAction->execute(
                AppLogLevelEnum::ERROR,
                AppLogRealmEnum::ORDER,
                "LockDraftOrder: Failed to move order [{$order->id}] from DRAFT to CREATED: {$e->getMessage()}"
            );
            throw $e;
        }
    }
}
