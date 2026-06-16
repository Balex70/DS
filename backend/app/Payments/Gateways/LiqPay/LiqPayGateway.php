<?php

namespace App\Payments\Gateways\LiqPay;

use App\Enums\PaymentStatusEnum;
use App\Events\PaymentChangedStatus;
use App\Models\Payment;
use App\Payments\DTO\PaymentRequestDTO;
use App\Payments\DTO\PaymentResponseDTO;
use App\Payments\Gateways\AbstractGateway;
use Illuminate\Http\Request;
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

    public function handleWebhook(Request $request): void
    {
        $data = $request->input('data');
        $signature = $request->input('signature');

        $privateKey = config('payments.liqpay.private_key');

        $expectedSignature = base64_encode(
            sha1(
                $privateKey . $data . $privateKey,
                true
            )
        );

        // Verify signature
        if (!hash_equals($expectedSignature, $signature)) {
            $this->log([
                'liqpay' => 'handleWebhook - invalid signature'
            ]);
            abort(403);
        }

        $payload = json_decode(
            base64_decode($data),
            true
        );

        // Verify transaction exists
        $payment = Payment::where(
            'transaction_id',
            $payload['order_id']
        )->first();

        if (! $payment) {
            $this->log([
                'liqpay' => 'handleWebhook - payment with not found: ' + $payload['order_id']
            ]);
            abort(404);
        }

        $statusToUpdate = $this->mapStatus(
            $payload['status']
        );

        $payment->update([
            'status' => $statusToUpdate,
            'gateway_payment_id' => $payload['payment_id'] ?? null,
        ]);

        PaymentChangedStatus::dispatch($payment->order, $statusToUpdate);
    }

    private function mapStatus(string $status): PaymentStatusEnum
    {
        return match ($status) {

            /*
            * Success
            */
            'success',
            'subscribed',
            'sandbox',
            'wait_compensation' => PaymentStatusEnum::PAID,

            /*
            * Final failures
            */
            'error',
            'failure',
            'unsubscribed' => PaymentStatusEnum::FAILED,

            /*
            * Refund
            */
            'reversed' => PaymentStatusEnum::REFUNDED,

            /*
            * Still in progress
            */
            'prepared',
            'processing',
            '3ds_verify',
            'captcha_verify',
            'cvv_verify',
            'ivr_verify',
            'otp_verify',
            'password_verify',
            'phone_verify',
            'pin_verify',
            'receiver_verify',
            'sender_verify',
            'senderapp_verify',
            'wait_qr',
            'wait_sender',
            'cash_wait',
            'hold_wait',
            'invoice_wait',
            'wait_accept',
            'wait_card',
            'wait_lc',
            'wait_reserve',
            'wait_secure' => PaymentStatusEnum::PENDING,

            default => PaymentStatusEnum::PENDING,
        };
    }

    public function updateStatus(string $transactionId): bool
    {
        $payment = Payment::where(
            'transaction_id',
            $transactionId
        )->first();

        if (!$payment) {
            return false;
        }

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

            $statusToUpdate = $this->mapStatus(
                $response->status
            );

            $payment->update([
                'status' => $statusToUpdate,
            ]);

            PaymentChangedStatus::dispatch($payment->order, $statusToUpdate);
            return true;
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
