<?php
namespace App\Payments\DTO;

class PaymentRequestDTO
{
    public function __construct(
        public readonly int $orderId,
        public readonly string $public_token,
        public readonly int $amount, // in cents
        public readonly string $currency,
        public readonly string $country,
        public readonly string $email,
        public readonly array $methods = [],
        public readonly string $successUrl = '',
        public readonly string $cancelUrl = '',
    ) {}
}
