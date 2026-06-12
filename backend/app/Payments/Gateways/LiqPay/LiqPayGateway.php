<?php

namespace App\Payments\Gateways\LiqPay;

use App\Payments\DTO\PaymentRequestDTO;
use App\Payments\DTO\PaymentResponseDTO;
use App\Payments\Gateways\AbstractGateway;
use Illuminate\Support\Str;
use LiqPay;

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

    public function createPayment(PaymentRequestDTO $request): PaymentResponseDTO
    {
        $this->log([
            'liqpay' => 'create_payment',
            'order' => $request->orderId,
        ]);

        $publicKey = config('payments.liqpay.public_key');
        $privateKey = config('payments.liqpay.private_key');

        $liqpay = new LiqPay($publicKey, $privateKey);

        $orderReference = 'ORDER_' . $request->orderId . '_PAY_' . Str::uuid();

        $amount = number_format(
            $request->amount / 100,
            2,
            '.',
            ''
        );

        $params = [
            'version' => 3,
            'action' => 'pay',
            'amount' => $amount,
            'currency' => $request->currency,
            'description' => 'Order #' . $request->orderId,
            'order_id' => $orderReference,

            'result_url' => config('payments.liqpay.return_url')
                . '/payment-result?token='
                . $request->public_token,

            'server_url' => config('payments.liqpay.server_url'),

            'language' => 'en',

            'customer' => $request->email,
        ];

        /*
         * Generate checkout data/signature using SDK
         */
        $data = $liqpay->cnb_form_raw($params);

        return new PaymentResponseDTO(
            success: true,
            transactionId: $orderReference,
            redirectUrl: $data['url'], // 'https://www.liqpay.ua/api/3/checkout'
            payload: [
                'data' => $data['data'],
                'signature' => $data['signature'],
            ]
        );
    }

    public function verify(string $transactionId): bool
    {
        try {
            $liqpay = new LiqPay(
                config('payments.liqpay.public_key'),
                config('payments.liqpay.private_key')
            );

            $response = $liqpay->api('payment/status', [
                'version' => 3,
                'action' => 'status',
                'order_id' => $transactionId,
            ]);

            return in_array(
                $response->status ?? null,
                ['success', 'sandbox']
            );
        } catch (\Throwable $e) {
            logger()->error('LiqPay verification failed', [
                'transaction_id' => $transactionId,
                'message' => $e->getMessage(),
            ]);

            return false;
        }
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
