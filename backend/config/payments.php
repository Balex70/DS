<?php
return [
    'default' => env('PAYMENT_GATEWAY', 'stripe'),
    'stripe' => [
        'enabled' => true,
    ],
    'wayforpay' => [
        'enabled' => false,
        'merchant_account' => env('WFP_MERCHANT_ACCOUNT', 'test_merch_n1'), // test account
        'merchant_secret' => env('WFP_MERCHANT_SECRET', 'flk3409refn54t54t*FNJRET'), // test secret
        'return_url' => env('WFP_RETURN_URL'),
        'service_url' => env('WFP_SERVICE_URL'),
    ],
    'liqpay' => [
        'enabled' => true,
        'public_key' => env('LIQPAY_PUBLIC_KEY', 'sandbox'),
        'private_key' => env('LIQPAY_PRIVATE_KEY', 'adsfgsfg2345tgbs'),
        'return_url' => env('LIQPAY_RETURN_URL'),
        'server_url' => env('LIQPAY_SERVER_URL'),
    ],
];
