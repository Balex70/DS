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

    public function isAvailable(
        string $country,
        ?string $currency = null,
        array $methods = []
    ): bool {
        if (!config('services.stripe.enabled')) {
            return false;
        }

        return $this->supportsCountry($country)
            && $this->supportsCurrency($currency)
            && $this->supportsMethod($methods);
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

    public function supportsCountry(string $country): bool
    {
        // Stripe = global, except maybe restricted regions
        return in_array($country, ['US', 'EU', 'PL', 'DE', 'FR']);
    }

    public function supportsCurrency(string $currency): bool
    {
        return in_array($currency, ['USD', 'EUR', 'GBP']);
    }

    public function supportsMethod(array $methods): bool
    {
        // Stripe supports everything via cards + wallets
        return true;
    }
}
