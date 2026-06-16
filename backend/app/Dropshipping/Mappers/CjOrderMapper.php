<?php

namespace App\Dropshipping\Mappers;

class CjOrderMapper
{
    public function map(array $data): array
    {
        return [
            'orderNumber' => $data['order_number'],

            'shippingZip' => $data['shipping']['zip'],
            'shippingCountry' => $data['shipping']['country'],
            'shippingCountryCode' => $data['shipping']['country_code'],
            'shippingProvince' => $data['shipping']['state'],
            'shippingCity' => $data['shipping']['city'],
            'shippingCounty' => $data['shipping']['county'] ?? '',

            'shippingPhone' => $data['shipping']['phone'],
            'shippingCustomerName' => $data['shipping']['name'],

            'shippingAddress' => $data['shipping']['address'],
            'shippingAddress2' => $data['shipping']['address2'] ?? '',

            'email' => $data['shipping']['email'] ?? '',

            'remark' => $data['remark'] ?? '',
            'logisticName' => $data['shipping_method'],
            'fromCountryCode' => $data['from_country_code'] ?? '',

            'houseNumber' => $data['shipping']['house_number'] ?? '',

            // default would be API if omitted
            // 'platform' => 'shopify',

            'shopLogisticsType' => 2,
            'orderFlow' => 1, // use vid instead sku
            
            'isSandbox' => $data['is_sandbox'] ?? 0,

            'products' => array_map(function ($item) {
                return [
                    'vid' => $item['vid'],
                    'quantity' => $item['quantity'],
                    // 'storeLineItemId' => $item['line_item_id'],
                ];
            }, $data['items']),
        ];
    }
}
