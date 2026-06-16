<?php
namespace App\Payments\DTO;

class PaymentResponseDTO
{
    public function __construct(
        public readonly bool $success,
        public readonly ?string $transactionId,
        public readonly ?string $redirectUrl,
        public readonly array $payload = [],
    ) {}
}
