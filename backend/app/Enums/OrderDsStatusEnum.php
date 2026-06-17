<?php
namespace App\Enums;

enum OrderDsStatusEnum: string
{
    // https://developers.cjdropshipping.com/en/api/api2/api/shopping.html#order-status
    // CREATED	    Order Created
    // IN_CART	    Order in cart
    // UNPAID	    Order unpaid
    // UNSHIPPED	Order has been paid and is currently pending shipment
    // SHIPPED	    Order Shipped and in transit
    // DELIVERED	Package delivered
    // CANCELLED	Order cancelled

    case CREATED = 'created';
    case UNPAID = 'unpaid';
    case PROCESSING = 'processing'; // processing means "unshipped"
    case SHIPPED = 'shipped';
    case DELIVERED = 'delivered';
    case CANCELLED = 'cancelled';
    case FAILED = 'failed';
}
