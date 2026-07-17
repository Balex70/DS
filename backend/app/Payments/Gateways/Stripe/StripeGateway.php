<?php
namespace App\Payments\Gateways\Stripe;

use App\Enums\CurrenciesEnum;
use App\Payments\DTO\PaymentRequestDTO;
use App\Payments\DTO\PaymentResponseDTO;
use App\Payments\Gateways\AbstractGateway;
use Illuminate\Http\Request;

class StripeGateway extends AbstractGateway
{
    private const SUPPORTED_COUNTRIES = [];

    public function getName(): string
    {
        return 'stripe';
    }

    public function isAvailable(
        string $country,
        ?string $currency = null,
        array $methods = []
    ): bool {
        if (!config('payments.stripe.enabled')) {
            return false;
        }

        return $this->supportsCountry($country)
            && $this->supportsCurrency($currency)
            && $this->supportsMethod($methods);
    }

    public function createPayment(PaymentRequestDTO $request): PaymentResponseDTO
    {
        $this->log(['stripe' => 'create_payment', 'order' => $request->orderId]);
        // TODO: temporary return exception for testing
        throw new \Exception("Error Processing Request", 1);

        // Stripe SDK logic here

        return new PaymentResponseDTO(
            success: true,
            transactionId: 'stripe_tx_123',
            // redirectUrl: 'https://stripe.com/checkout/...'
            redirectUrl: null
        );
    }

    public function handleWebhook(Request $request): void
    {
    }

    public function updateStatus(string $transactionId): bool
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
        return in_array($country, self::SUPPORTED_COUNTRIES, true);
    }

    public function supportsCurrency(string $currency): bool
    {
        return in_array($currency, [CurrenciesEnum::USD->value]);
    }

    public function supportsMethod(array $methods): bool
    {
        // Stripe supports everything via cards + wallets
        return true;
    }

    public function getPriority(): int
    {
        return 100;
    }

    public function getPaymentMethods(): array
    {
        return [
            'card',
            'apple_pay',
            'google_pay',
            'link',
        ];
    }
}
