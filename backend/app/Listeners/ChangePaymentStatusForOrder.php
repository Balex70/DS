<?php

namespace App\Listeners;

use App\Actions\CreateAppLogAction;
use App\Enums\AppLogLevelEnum;
use App\Enums\AppLogRealmEnum;
use App\Enums\OrderStatusEnum;
use App\Events\PaymentChangedStatus;

class ChangePaymentStatusForOrder
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
    public function handle(PaymentChangedStatus $event): void
    {
        $order = $event->order->fresh();
        try {
            // Change payment status only if the order is not canceled or refunded or shipped or delivered
            if (in_array($order->status, [
                OrderStatusEnum::CANCELED,
                OrderStatusEnum::REFUNDED,
                OrderStatusEnum::SHIPPED,
                OrderStatusEnum::DELIVERED
            ], true)) {
                $this->createAppLogAction->execute(
                    AppLogLevelEnum::WARNING,
                    AppLogRealmEnum::ORDER,
                    "Payment status change rejected for order: {$order->id}
Order status [{$order->status->value}] does not allow payment status changes."
                );
                return;
            }

            $oldStatus = $order->payment_status;
            $order->update([
                'payment_status' => $event->status,
            ]);

            $this->createAppLogAction->execute(
                    AppLogLevelEnum::SUCCESS,
                    AppLogRealmEnum::ORDER,
                    "Payment status changed for:
Order: {$order->id}
Old status: " . $oldStatus . "
New status: " . $order->payment_status
                );
        } catch (\Throwable $e) {
            $this->createAppLogAction->execute(
                AppLogLevelEnum::ERROR,
                AppLogRealmEnum::ORDER,
                "Payment status changed (PaymentChangedStatus) failed for order: {$order->id}, error: {$e->getMessage()}"
            );
            throw $e;
        }
    }
}
