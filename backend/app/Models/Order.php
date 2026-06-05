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
    'note'
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
            'sd_status' => OrderDsStatusEnum::class
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

    protected static function booted(): void
    {
        static::creating(function (Order $order) {
            if (empty($order->public_token)) {
                $order->public_token = (string) Str::uuid();
            }
        });
    }
}
