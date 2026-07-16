<?php

namespace App\Services;

use App\Currency\Services\PriceConverter;
use App\Dropshipping\DropshippingManager;
use App\Enums\CurrenciesEnum;
use App\Enums\OrderStatusEnum;
use App\Enums\PaymentStatusEnum;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StoreOrderService
{
    public function __construct(
        private DropshippingManager $manager,
        private PriceConverter $converter
    ) {}
    
    public function upsertOrderByCheckoutToken(array $data, mixed $items, string $cartToken): Order
    {
        $subtotal = collect($items)->sum(fn ($item) => $item['price'] * $item['quantity']);
        $shipping = $data['shipping_cost'] ?? 0;
        $total = $subtotal + $shipping;
        $customer = auth('customer')->user();

        // 1. Check if a pending order already exists for this checkout token
        $existingOrder = Order::where('checkout_token', $cartToken)
            ->where('status', OrderStatusEnum::DRAFT)
            ->first();

        return DB::transaction(function () use ($existingOrder, $items, $subtotal, $shipping, $total, $customer, $data, $cartToken) {

            // Shared data payload for both Create and Update actions
            $orderData = [
                'subtotal' => $subtotal,
                'shipping_cost' => $shipping,
                'total' => $total,

                'currency' => $data['currency'] ?? 'USD',
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
                'checkout_token' => $cartToken,
            ];

            if ($existingOrder) {
                // Scenario A: Update existing order
                $existingOrder->update($orderData);
                $order = $existingOrder;

                // Wipe old items so we can completely rebuild them based on the current cart
                $order->items()->delete();
            } else {
                // Scenario B: Create a fresh order record
                $extraData = [
                    'order_number' => 'ORD-' . strtoupper(Str::random(10)),
                    'customer_id' => $customer ? $customer->id : null,
                    'ds_provider' => $data['ds_provider'] ?? 'cj',
                    'status' => OrderStatusEnum::DRAFT,
                    'payment_status' => PaymentStatusEnum::DRAFT,
                ];

                $order = Order::create(array_merge($orderData, $extraData));
            }

            // 2. Insert/Recreate order items seamlessly
            foreach ($items as $item) {
                $order->items()->create([
                    'product_id' => $item['product_id'] ?? null,
                    'vid' => $item['vid'] ?? null,
                    'sku' => $item['sku'] ?? null,
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

    public function calculateShipping(array $payload, string | null $currency = null): array
    {
        $provider = $this->manager->driver();

        $shippingOptions = $provider->calculateShipping($payload);

        if($currency && $currency !== CurrenciesEnum::USD->value) {
            return array_map(function ($item) use ($currency) {
                $item['currency_price'] = $this->converter->convert(
                    $item['price'],
                    CurrenciesEnum::USD->value,
                    $currency,
                );

                return $item;
            }, $shippingOptions);
        }

        return $shippingOptions;
    }
}
