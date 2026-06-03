<?php
namespace App\Payments\Gateways\Stripe;

use App\Payments\DTO\PaymentRequestDTO;
use App\Payments\DTO\PaymentResponseDTO;
use App\Payments\Gateways\AbstractGateway;

class StripeGateway extends AbstractGateway
{
    public function getName(): string
    {
        return 'stripe';
    }

    public function createPayment(PaymentRequestDTO $request): PaymentResponseDTO
    {
        $this->log(['stripe' => 'create_payment', 'order' => $request->orderId]);

        // Stripe SDK logic here

        return new PaymentResponseDTO(
            success: true,
            transactionId: 'stripe_tx_123',
            redirectUrl: 'https://stripe.com/checkout/...'
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
