<?php
namespace App\Enums;

enum PaymentStatusEnum: string
{
    case DRAFT = 'draft';
    case PENDING = 'pending';
    case PAID = 'paid';
    case FAILED = 'failed';
    case REFUNDED = 'refunded';
    case CANCELED = 'canceled';
}
