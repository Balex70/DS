<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OrderItem>
 */
class OrderItemFactory extends Factory
{
    protected $model = OrderItem::class;

    public function definition(): array
    {
        $quantity = $this->faker->numberBetween(1, 5);
        $price = $this->faker->numberBetween(500, 10000); // cents-like integer
        $total = $quantity * $price;

        return [
            'order_id' => Order::factory(),

            // internal product (can be null for CJ-only or deleted products)
            'product_id' => Product::factory(),

            // snapshot (VERY important for dropshipping stability)
            'title' => $this->faker->words(3, true),

            'quantity' => $quantity,

            'price' => $price,
            'total' => $total,

            // variant snapshot (size, color, etc.)
            'variant_data' => $this->faker->optional()->randomElement([
                [
                    'size' => $this->faker->randomElement(['S', 'M', 'L', 'XL']),
                    'color' => $this->faker->safeColorName(),
                ],
                [
                    'color' => $this->faker->safeColorName(),
                ],
                null,
            ]),
        ];
    }

    /**
     * State: high quantity order item
     */
    public function bulk(): static
    {
        return $this->state(fn () => [
            'quantity' => $this->faker->numberBetween(5, 20),
        ]);
    }

    /**
     * State: expensive product
     */
    public function expensive(): static
    {
        return $this->state(fn () => [
            'price' => $this->faker->numberBetween(10000, 50000),
        ]);
    }

    /**
     * State: no internal product (CJ-only item)
     */
    public function external(): static
    {
        return $this->state(fn () => [
            'product_id' => null,
        ]);
    }
}
