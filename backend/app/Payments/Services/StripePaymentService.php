<?php
namespace App\Payments\Services;

use App\Payments\DTO\PaymentRequestDTO;

class StripePaymentService
{
    public function buildPayload(PaymentRequestDTO $dto): array
    {
        return [
            'amount' => $dto->amount,
            'currency' => $dto->currency,
            'metadata' => [
                'order_id' => $dto->orderId,
            ],
        ];
    }
}
