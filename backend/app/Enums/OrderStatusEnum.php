<?php
namespace App\Enums;

enum OrderStatusEnum: string
{
    case DRAFT = 'draft';
    case CREATED = 'created';
    case PROCESSING = 'processing';
    case SHIPPED = 'shipped';
    case DELIVERED = 'delivered';
    case CANCELED = 'canceled';
    case REFUNDED = 'refunded';

    public function canBeCancelled(): bool
    {
        return match ($this) {
            self::DRAFT,
            self::CREATED => true,

            self::PROCESSING,
            self::SHIPPED,
            self::DELIVERED,
            self::CANCELED,
            self::REFUNDED => false,
        };
    }
}
