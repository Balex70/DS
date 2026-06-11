<?php

namespace App\Payments\Gateways\LiqPay;

use App\Payments\DTO\PaymentRequestDTO;
use App\Payments\DTO\PaymentResponseDTO;
use App\Payments\Gateways\AbstractGateway;
use Illuminate\Support\Str;

class LiqPayGateway extends AbstractGateway
{
    public function getName(): string
    {
        return 'liqpay';
    }

    public function isAvailable(
        string $country,
        ?string $currency = null,
        array $methods = []
    ): bool {
        if (! config('payments.liqpay.enabled')) {
            return false;
        }

        return $this->supportsCountry($country)
            && $this->supportsCurrency($currency)
            && $this->supportsMethod($methods);
    }

    public function createPayment(PaymentRequestDTO $request): PaymentResponseDTO {

        $this->log([
            'liqpay' => 'create_payment',
            'order' => $request->orderId,
        ]);

        $publicKey = config('payments.liqpay.public_key');
        $privateKey = config('payments.liqpay.private_key');

        $orderId = 'ORDER_' . $request->orderId . '_PAY_' . Str::uuid();

        $amount = number_format(
            $request->amount / 100,
            2,
            '.',
            ''
        );

        $params = [
            'version' => 3,
            'public_key' => $publicKey,

            'action' => 'pay',

            'amount' => $amount,
            'currency' => $request->currency,

            'description' => 'Order #' . $request->orderId,
            'order_id' => $orderId,

            'result_url' =>
                config('payments.liqpay.return_url')
                . '/payment-result?token='
                . $request->public_token,

            'server_url' =>
                config('payments.liqpay.server_url'),

            'language' => 'uk',

            'customer' => $request->email,
        ];

        $data = base64_encode(
            json_encode(
                $params,
                JSON_UNESCAPED_UNICODE
            )
        );

        $signature = base64_encode(
            sha1(
                $privateKey . $data . $privateKey,
                true
            )
        );

        return new PaymentResponseDTO(
            success: true,
            transactionId: $orderId,

            /*
             * Frontend will submit POST form
             */
            redirectUrl: 'https://www.liqpay.ua/api/3/checkout',

            raw: [
                'data' => $data,
                'signature' => $signature,
            ]
        );
    }

    public function verify(string $transactionId): bool
    {
        return true;
    }

    public function refund(string $transactionId, float $amount): bool {
        return false;
    }

    public function supportsCountry(string $country): bool {
        return $country === 'UA';
    }

    public function supportsCurrency(string $currency): bool {
        return in_array(
            $currency,
            ['UAH', 'USD', 'EUR']
        );
    }

    public function supportsMethod(array $methods): bool {
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
            'privat24',
        ];
    }
}
