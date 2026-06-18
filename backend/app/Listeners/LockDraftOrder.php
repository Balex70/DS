<?php

namespace App\Listeners;

use App\Enums\OrderStatusEnum;
use App\Enums\PaymentStatusEnum;
use App\Events\PaymentInitiated;

class LockDraftOrder
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
    public function handle(PaymentInitiated $event): void
    {
        $order = $event->order->fresh();

        // Lock the order by changing it from DRAFT to CREATED
        if ($order->status === OrderStatusEnum::DRAFT) {
            $order->update([
                'status' => OrderStatusEnum::CREATED,
                'payment_status' => PaymentStatusEnum::PENDING
            ]);
        }
    }
}
