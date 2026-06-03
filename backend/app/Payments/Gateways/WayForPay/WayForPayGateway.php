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

    public function isAvailable(
        string $country,
        ?string $currency = null,
        array $methods = []
    ): bool {
        if (!config('services.wayforpay.enabled')) {
            return false;
        }

        return $this->supportsCountry($country)
            && $this->supportsCurrency($currency)
            && $this->supportsMethod($methods);
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

    public function supportsCountry(string $country): bool
    {
        return $country === 'UA';
    }

    public function supportsCurrency(string $currency): bool
    {
        return in_array($currency, ['UAH', 'USD', 'EUR']);
    }

    public function supportsMethod(array $methods): bool
    {
        // supports cards + Apple Pay + Google Pay
        return true;
    }
}
