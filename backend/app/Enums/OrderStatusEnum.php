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
}
