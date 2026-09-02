<?php

namespace App\Models;

use App\Enums\OrderDsStatusEnum;
use App\Enums\OrderStatusEnum;
use App\Enums\PaymentStatusEnum;
use App\Models\OrderItem;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Laravel\Sanctum\HasApiTokens;

#[Fillable([
    'id', 'customer_id', 'public_token', 'checkout_token', 'subtotal', 'shipping_cost', 'total', 'shipping_method',
    'ds_provider', 'ds_order_id', 'ds_tracking_number', 'ds_status',
    'order_number', 'status', 'payment_method', 'payment_status',
    'shipping_full_name', 'shipping_phone', 'shipping_email', 'shipping_address_line1',
    'shipping_address_line2', 'shipping_city', 'shipping_state', 'shipping_postal_code', 'shipping_country',
    'note', 'shipped_at', 'delivered_at',
    'shipping_full_name_latin', 'shipping_address_line1_latin', 'shipping_address_line2_latin', 'shipping_city_latin', 'shipping_state_latin'
])]
class Order extends Model
{
    /** @use HasFactory<\Database\Factories\OrderFactory> */
    use HasFactory, HasApiTokens, Notifiable, SoftDeletes;

    protected function casts(): array
    {
        return [
            'status' => OrderStatusEnum::class,
            'payment_status' => PaymentStatusEnum::class,
            'ds_status' => OrderDsStatusEnum::class
        ];
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function canBeSendToDsProvider(): array
    {
        $errors = [];

        // check payment statues
        if ($this->payment_status !== PaymentStatusEnum::PAID) {
            $errors[] = 'Order is not paid';
        }

        // check order status
        if ($this->status === OrderStatusEnum::DRAFT) {
            $errors[] = 'Order is drafted only';
        }
        if ($this->status === OrderStatusEnum::PROCESSING) {
            $errors[] = 'Order is processing';
        }
        if ($this->status === OrderStatusEnum::SHIPPED) {
            $errors[] = 'Order is shipped already';
        }
        if ($this->status === OrderStatusEnum::DELIVERED) {
            $errors[] = 'Order is delivered already';
        }
        if ($this->status === OrderStatusEnum::CANCELED) {
            $errors[] = 'Order is canceled';
        }
        if ($this->status === OrderStatusEnum::REFUNDED) {
            $errors[] = 'Order is refunded';
        }

        // check if order has already been sent
        if ($this->ds_status !== null && $this->ds_status !== OrderDsStatusEnum::FAILED) {
            $errors[] = 'Order has already been sent to supplier';
        }

        if ($this->items()->count() === 0) {
            $errors[] = 'Order has no items';
        }

        return [
            'allowed' => empty($errors),
            'errors' => $errors,
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Order $order) {
            if (empty($order->public_token)) {
                $order->public_token = (string) Str::uuid();
            }
        });
    }
}
