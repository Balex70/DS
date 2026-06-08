<?php

namespace App\Listeners;

use App\Enums\OrderStatusEnum;
use App\Enums\PaymentStatusEnum;
use App\Events\PaymentInitiated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

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

        // Lock the order by changing it from DRAFT to PENDING
        if ($order->status === OrderStatusEnum::DRAFT) {
            $order->update([
                'status' => OrderStatusEnum::PENDING,
                'payment_status' => PaymentStatusEnum::PENDING
            ]);
        }
    }
}
