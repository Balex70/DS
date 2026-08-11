<?php

namespace App\Services;

class Settings
{
    public const DEFINITIONS = [
        'store.name' => [
            'type' => 'string',
            'default' => 'My Store',
        ],

        'checkout.guest_checkout' => [
            'type' => 'boolean',
            'default' => true,
        ],

        'orders.cancel_after_minutes' => [
            'type' => 'integer',
            'default' => 60,
        ],

        'shipping.free_shipping_threshold' => [
            'type' => 'float',
            'default' => 50.00,
        ],
    ];
}
