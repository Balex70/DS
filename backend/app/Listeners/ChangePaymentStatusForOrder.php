<?php

namespace App\Listeners;

use App\Enums\OrderStatusEnum;
use App\Events\PaymentChangedStatus;

class ChangePaymentStatusForOrder
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(PaymentChangedStatus $event): void
    {
        $order = $event->order->fresh();

        // Change payment status only if the order is not canceled or refunded or fulfilled
        if (in_array($order->status, [
            OrderStatusEnum::CANCELED,
            OrderStatusEnum::REFUNDED,
            OrderStatusEnum::FULFILLED,
        ], true)) {
            return;
        }

        $order->update([
            'payment_status' => $event->status,
        ]);
    }
}
