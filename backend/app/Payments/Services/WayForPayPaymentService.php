<?php
namespace App\Payments\Services;

use App\Payments\DTO\PaymentRequestDTO;

class WayForPayPaymentService
{
    public function buildPayload(PaymentRequestDTO $dto): array
    {
        return [
            'orderReference' => $dto->orderId,
            'amount' => $dto->amount,
            'currency' => $dto->currency,
        ];
    }
}
