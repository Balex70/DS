<?php

namespace App\Services;

use App\Dropshipping\DropshippingManager;
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
                'state' => $order->shipping_state,
                'city' => $order->shipping_city,
                'phone' => $order->shipping_phone,
                'name' => $order->shipping_full_name,
                'address' => $order->shipping_address_line1,
                'address2' => $order->shipping_address_line2,
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
}
