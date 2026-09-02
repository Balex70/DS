<?php

namespace App\Services;

use App\Dropshipping\DropshippingManager;
use App\Enums\OrderDsStatusEnum;
use App\Enums\OrderStatusEnum;
use App\Models\Order;

class OrderService
{
    public function __construct(
        private DropshippingManager $manager,
    ) {}
    
    public function sendOrder(Order $order)
    {
        $provider = $this->manager->driver();
        
        $payload = [
            'order_number' => $order->id,
            'shipping' => [
                'zip' => $order->shipping_postal_code,
                'country' => $order->shipping_country,
                'country_code' => $order->shipping_country,
                'state' => $order->shipping_state_latin ?? $order->shipping_state,
                'city' => $order->shipping_city_latin ?? $order->shipping_city,
                'phone' => $order->shipping_phone,
                'name' => $order->shipping_full_name_latin ?? $order->shipping_full_name,
                'address' => $order->shipping_address_line1_latin ?? $order->shipping_address_line1,
                'address2' => $order->shipping_address_line2_latin ?? $order->shipping_address_line2,
                'email' => $order->shipping_email,
            ],

            'shipping_method' => $order->shipping_method,
            'from_country_code' => 'CN',
            'orderFlow' => 1, // use vid instead sku
            
            'is_sandbox' => config('dropshipping.sandbox') ? 1 : 0,

            'items' => array_map(function ($item) {
                return [
                    'vid' => $item['vid'],
                    'quantity' => $item['quantity'],
                ];
            }, $order->items->toArray()),
            
        ];
        
        $provider->createOrder($payload);
    }

    public function checkOrderStatusInDSProvider(Order $order)
    {
        $provider = $this->manager->driver();

        $payload = [
            'orderId' => $order->id
        ];

        return $provider->checkOrderStatus($payload);
    }

    public function getTrackInfo(Order $order)
    {
        $provider = $this->manager->driver();

        // Comment this line if you want test tracking info
        if($order->ds_tracking_number === null) {
            return [
                'success' => false,
                'message' => 'DS tracing number not found!'
            ];
        }

        $payload = [
            'trackNumber' => $order->ds_tracking_number, // for testing 435340934
        ];

        return $provider->trackInfo($payload);
    }

    public function simulatePayOrder(Order $order)
    {
        $provider = $this->manager->driver();

        if($order->ds_order_id === null) {
            return [
                'success' => false,
                'message' => 'DS order ID not found!'
            ];
        }

        $payload = [
            'orderId' => $order->ds_order_id
        ];

        return $provider->simulatePayOrder($payload);
    }

    public function toOrderStatus(string $dsStatus): OrderStatusEnum {
        // https://developers.cjdropshipping.com/en/api/api2/api/shopping.html#order-status
        // TODO: create mappers for each ds providers
        return match ($dsStatus) {
            'CREATED',
            'IN_CART',
            'UNPAID',
            'UNSHIPPED'
                => OrderStatusEnum::PROCESSING,

            'SHIPPED'
                => OrderStatusEnum::SHIPPED,

            'DELIVERED'
                => OrderStatusEnum::DELIVERED,

            'CANCELLED'
                => OrderStatusEnum::CANCELED,

            default
                => OrderStatusEnum::PROCESSING,
        };
    }

    public function toDsStatus(string $dsStatus): OrderDsStatusEnum {
        // https://developers.cjdropshipping.com/en/api/api2/api/shopping.html#order-status
        // TODO: create mappers for each ds providers
        return match ($dsStatus) {
            'CREATED',
            'IN_CART'
                => OrderDsStatusEnum::CREATED,

            'UNPAID'
                => OrderDsStatusEnum::UNPAID,

            'UNSHIPPED' // UNSHIPPED: 300 | 400, be default is 300
                => OrderDsStatusEnum::PROCESSING,

            'SHIPPED'
                => OrderDsStatusEnum::SHIPPED,

            'DELIVERED'
                => OrderDsStatusEnum::DELIVERED,

            'CANCELLED'
                => OrderDsStatusEnum::CANCELLED,

            default
                => OrderDsStatusEnum::FAILED,
        };
    }
}
