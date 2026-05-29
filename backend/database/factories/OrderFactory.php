<?php

namespace Database\Factories;

use App\Enums\OrderDsStatusEnum;
use App\Enums\OrderStatusEnum;
use App\Enums\PaymentStatusEnum;
use App\Models\Customer;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        $subtotal = $this->faker->numberBetween(2000, 20000); // cents-like integers
        $shipping = $this->faker->numberBetween(0, 1500);
        $total = $subtotal + $shipping;

        $status = $this->faker->randomElement([
            OrderStatusEnum::PENDING,
            OrderStatusEnum::PAID,
            OrderStatusEnum::PROCESSING,
            OrderStatusEnum::FULFILLED,
            OrderStatusEnum::CANCELED,
            OrderStatusEnum::REFUNDED,
        ]);

        $paymentStatus = $this->faker->randomElement([
            PaymentStatusEnum::UNPAID,
            PaymentStatusEnum::PAID,
            PaymentStatusEnum::FAILED,
            PaymentStatusEnum::REFUNDED,
        ]);

        $dsStatus = $this->faker->randomElement([
            OrderDsStatusEnum::PENDING,
            OrderDsStatusEnum::PAID,
            OrderDsStatusEnum::PROCESSING,
            OrderDsStatusEnum::SHIPPED,
            OrderDsStatusEnum::DELIVERED,
            OrderDsStatusEnum::FAILED,
        ]);

        $countries = ['US', 'PL', 'DE', 'GB', 'FR', 'UA'];

        return [
            'order_number' => 'ORD-' . strtoupper(Str::random(10)),

            'customer_id' => Customer::factory(), // or null if guest
            // 'customer_id' => null,

            'ds_provider' => 'cj',
            'ds_order_id' => $this->faker->optional()->uuid(),
            'ds_tracking_number' => $this->faker->optional()->regexify('[A-Z0-9]{12}'),
            'ds_status' => $dsStatus,

            'subtotal' => $subtotal,
            'shipping_cost' => $shipping,
            'total' => $total,

            'currency' => 'USD',

            'status' => $status,

            'payment_method' => $this->faker->randomElement([
                'stripe',
                'paypal',
                'cod',
                'bank_transfer',
            ]),
            'payment_status' => $paymentStatus,

            'shipping_full_name' => $this->faker->name(),
            'shipping_phone' => $this->faker->optional()->phoneNumber(),
            'shipping_email' => $this->faker->optional()->safeEmail(),

            'shipping_address_line1' => $this->faker->streetAddress(),
            'shipping_address_line2' => $this->faker->optional()->secondaryAddress(),
            'shipping_city' => $this->faker->city(),
            'shipping_state' => $this->faker->optional()->state(),
            'shipping_postal_code' => $this->faker->postcode(),
            'shipping_country' => $this->faker->randomElement($countries),

            'sent_to_ds_provider' => $this->faker->boolean(30),
            'sent_to_ds_provider_at' => $this->faker->optional()->dateTimeBetween('-10 days', 'now'),

            'fulfilled_at' => $status === OrderStatusEnum::FULFILLED
                ? $this->faker->dateTimeBetween('-5 days', 'now')
                : null,

            'notes' => $this->faker->optional()->sentence(),
        ];
    }

    /**
     * State: paid order
     */
    public function paid(): static
    {
        return $this->state(fn () => [
            'status' => OrderStatusEnum::PAID,
            'payment_status' => PaymentStatusEnum::PAID,
        ]);
    }

    /**
     * State: fulfilled order
     */
    public function fulfilled(): static
    {
        return $this->state(fn () => [
            'status' => OrderStatusEnum::FULFILLED,
            'payment_status' => PaymentStatusEnum::PAID,
            'ds_status' => OrderDsStatusEnum::DELIVERED,
            'fulfilled_at' => now(),
            'sent_to_ds_provider' => true,
            'sent_to_ds_provider_at' => now()->subDays(rand(1, 5)),
        ]);
    }

    /**
     * State: guest order
     */
    public function guest(): static
    {
        return $this->state(fn () => [
            'customer_id' => null,
        ]);
    }
}
