<?php
namespace App\Payments\Contracts;

use App\Payments\DTO\PaymentRequestDTO;
use App\Payments\DTO\PaymentResponseDTO;

interface PaymentGatewayInterface
{
    public function getName(): string;

    public function isAvailable(string $country, ?string $currency = null, array $methods = []): bool;

    public function createPayment(PaymentRequestDTO $request): PaymentResponseDTO;

    public function verify(string $transactionId): bool;

    public function refund(string $transactionId, float $amount): bool;

    public function supportsCountry(string $country): bool;

    public function supportsCurrency(string $currency): bool;

    public function supportsMethod(array $methods): bool;

    public function getPriority(): int;

    public function getPaymentMethods(): array;
}
