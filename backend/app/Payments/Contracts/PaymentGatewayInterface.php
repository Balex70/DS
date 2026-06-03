<?php
namespace App\Payments\Contracts;

use App\Payments\DTO\PaymentRequestDTO;
use App\Payments\DTO\PaymentResponseDTO;

interface PaymentGatewayInterface
{
    public function getName(): string;

    public function createPayment(PaymentRequestDTO $request): PaymentResponseDTO;

    public function verify(string $transactionId): bool;

    public function refund(string $transactionId, float $amount): bool;
}
