<?php

namespace App\Services;

use App\Dropshipping\DropshippingManager;
use App\Enums\OrderDsStatusEnum;
use App\Enums\OrderStatusEnum;
use App\Enums\PaymentStatusEnum;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StoreOrderService
{
    public function __construct(
        private DropshippingManager $manager,
    ) {}
    
    public function storeOrder(array $data, mixed $items): Order
    {
        $subtotal = collect($items)->sum(fn ($item) => $item['price'] * $item['quantity']);
        $shipping = $data['shipping_cost'] ?? 0;
        $total = $subtotal + $shipping;
        $customer = auth('customer')->user();
        
        return DB::transaction(function () use ($items, $subtotal, $shipping, $total, $customer, $data) {
            $order = Order::create([
                'order_number' => 'ORD-' . strtoupper(Str::random(10)),

                'customer_id' => $customer ? $customer->id : null,

                'subtotal' => $subtotal,
                'shipping_cost' => $shipping,
                'total' => $total,

                'currency' => $data['currency'] ?? 'USD',

                'ds_provider' => $data['ds_provider'] ?? 'cj',
                'ds_status' => OrderDsStatusEnum::PENDING,

                'status' => OrderStatusEnum::PENDING,
                'payment_status' => PaymentStatusEnum::PENDING,

                'payment_method' => $data['payment_method'] ?? null,

                'shipping_method' => $data['shipping_method'],
                'shipping_full_name' => $data['shipping_full_name'],
                'shipping_phone' => $data['shipping_phone'] ?? null,
                'shipping_email' => $data['shipping_email'] ?? null,

                'shipping_address_line1' => $data['shipping_address_line1'],
                'shipping_address_line2' => $data['shipping_address_line2'] ?? null,
                'shipping_city' => $data['shipping_city'],
                'shipping_state' => $data['shipping_state'] ?? null,
                'shipping_postal_code' => $data['shipping_postal_code'] ?? null,
                'shipping_country' => $data['shipping_country'],

                'notes' => $data['notes'] ?? null,
            ]);

            // Create order items
            foreach ($items as $item) {
                $order->items()->create([
                    'product_id' => $item['product_id'] ?? null,
                    'title' => $item['title'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'total' => $item['price'] * $item['quantity'],
                    'variant_data' => $item['variant_data'] ?? null,
                ]);
            }
            
            return $order;
        });
    }

    public function calculateShipping(array $payload): array
    {
        $provider = $this->manager->driver();

        return $provider->calculateShipping($payload);
    }
}
