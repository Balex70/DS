<?php

namespace App\Models;

use App\Enums\PaymentStatusEnum;
use App\Models\Order;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'id', 'order_id', 'gateway', 'transaction_id', 'gateway_payment_id',
    'amount', 'currency', 'status', 'paid_at', 'failed_at', 'refunded_at',
    'canceled_at',
])]
class Payment extends Model
{
    /** @use HasFactory<\Database\Factories\OrderFactory> */
    use HasFactory;

    protected $casts = [
        'status' => PaymentStatusEnum::class,
        'gateway_response' => 'array',
        'paid_at' => 'datetime',
        'failed_at' => 'datetime',
        'refunded_at' => 'datetime',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
