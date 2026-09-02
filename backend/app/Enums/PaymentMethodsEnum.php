<?php
namespace App\Enums;

enum PaymentMethodsEnum: string
{
    case CARD = 'card';
    case APPLE_PAY = 'apple_pay';
    case GOOGLE_PAY = 'google_pay';
    case LINK = 'link';
    case PRIVAT24 = 'privat24';
}
