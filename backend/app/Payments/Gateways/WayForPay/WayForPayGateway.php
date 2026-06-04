<?php
namespace App\Payments\Gateways\WayForPay;

use App\Payments\DTO\PaymentRequestDTO;
use App\Payments\DTO\PaymentResponseDTO;
use App\Payments\Gateways\AbstractGateway;
use Illuminate\Support\Facades\Http;

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

        $merchantAccount = config('payments.wayforpay.merchant_account');
        $merchantSecret  = config('payments.wayforpay.merchant_secret');
        $domain          = config('app.url');

        $orderReference = 'ORDER_' . $request->orderId;
        $orderDate = time();

        $amount = number_format($request->amount / 100, 2, '.', '');
        $currency = $request->currency;

        $productName  = ['Order #' . $request->orderId];
        $productPrice = [$amount];
        $productCount = [1];

        // 1. Signature (IMPORTANT ORDER)
        $signatureString = implode(';', [
            $merchantAccount,
            $domain,
            $orderReference,
            $orderDate,
            $amount,
            $currency,
            implode(';', $productName),
            implode(';', $productCount),
            implode(';', $productPrice),
        ]);

        $merchantSignature = hash_hmac('md5', $signatureString, $merchantSecret);

        // 2. API payload (THIS IS WHAT DOC 852194 DESCRIBES)
        $payload = [
            "apiVersion" => 1,
            "transactionType" => "CREATE_INVOICE",
            "merchantAccount" => $merchantAccount,
            "merchantAuthType" => "SimpleSignature",
            "merchantDomainName" => $domain,

            "orderReference" => $orderReference,
            "orderDate" => $orderDate,
            "amount" => $amount,
            "currency" => $currency,

            "productName" => $productName,
            "productPrice" => $productPrice,
            "productCount" => $productCount,

            "clientEmail" => $request->email,

            "returnUrl" => config('payment.wayforpay.return_url'),
            "serviceUrl" => config('payment.wayforpay.service_url'),

            "merchantSignature" => $merchantSignature,
        ];

        // 3. POST to WayForPay API
        $response = Http::asJson()->post(
            'https://api.wayforpay.com/api',
            $payload
        );

        $data = $response->json();
        logger()->info('WayForPay raw response', [
            'status' => $response->status(),
            'body' => $response->body(),
            'payload' => $payload,
        ]);

        if (!isset($data['invoiceUrl'])) {
            throw new \Exception('WayForPay invoice creation failed');
        }

        return new PaymentResponseDTO(
            success: true,
            transactionId: $orderReference,
            redirectUrl: $data['invoiceUrl'],
            raw: $data
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
