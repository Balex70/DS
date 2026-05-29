<?php
namespace App\Enums;

enum OrderStatusEnum: string
{
    case PENDING = 'pending';
    case PAID = 'paid';
    case PROCESSING = 'processing';
    case FULFILLED = 'fulfilled';
    case CANCELED = 'canceled';
    case REFUNDED = 'refunded';
}
