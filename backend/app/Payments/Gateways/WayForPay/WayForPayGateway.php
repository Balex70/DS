<?php
namespace App\Payments\Gateways\WayForPay;

use App\Payments\DTO\PaymentRequestDTO;
use App\Payments\DTO\PaymentResponseDTO;
use App\Payments\Gateways\AbstractGateway;

class WayForPayGateway extends AbstractGateway
{
    public function getName(): string
    {
        return 'wayforpay';
    }

    public function createPayment(PaymentRequestDTO $request): PaymentResponseDTO
    {
        $this->log(['wayforpay' => 'create_payment', 'order' => $request->orderId]);

        return new PaymentResponseDTO(
            success: true,
            transactionId: 'wfp_tx_123',
            redirectUrl: 'https://secure.wayforpay.com/pay/...'
        );
    }

    public function verify(string $transactionId): bool
    {
        return true;
    }

    public function refund(string $transactionId, float $amount): bool
    {
        return true;
    }
}
