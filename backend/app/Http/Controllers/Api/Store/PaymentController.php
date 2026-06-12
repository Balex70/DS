<?php
namespace App\Http\Controllers\Api\Store;

use App\Enums\PaymentStatusEnum;
use App\Events\PaymentInitiated;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Payments\DTO\PaymentRequestDTO;
use App\Payments\PaymentManager;
use App\Services\CartService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;

class PaymentController extends Controller
{
    public function __construct(
        private PaymentManager $manager
    ) {}
    public function create(Request $request, Order $order, CartService $cartService)
    {
        // abort_unless($order->customer_id === $request->user()->id, 403);

        $data = $request->validate([
            'payment_method' => 'required|string',
        ]);

        $gateway = $this->manager->driver($data['payment_method']);

        $paymentResponse = $gateway->createPayment(
            new PaymentRequestDTO(
                orderId: $order->id,
                public_token: $order->public_token,
                amount: $order->total,
                currency: $order->currency ?? 'USD',
                country: $order->shipping_country,
                email: $order->shipping_email,
                methods: [],
            )
        );

        // store payment
        $order->payments()->create([
            'gateway' => $gateway->getName(),
            'transaction_id' => $paymentResponse->transactionId,
            'amount' => $order->total,
            'currency' => $order->currency,
            'status' => PaymentStatusEnum::PENDING,
        ]);

        // Dispatch the event right before giving the user the URL
        // This immediately marks the order as PENDING behind the scenes
        PaymentInitiated::dispatch($order); // TODO: PaymentPassed for scenario where payment is actually bypass (failed or paid or canceled)

        // Clear the cart
        $token = $request->attributes->get('cart_token');

        if ($token) {
            $cartService->clear($token);
        }

        Cookie::queue(Cookie::forget('cart_token'));

        return response()->json([
            'redirect_url' => $paymentResponse->redirectUrl,
            'payload' => $paymentResponse->payload,
        ]);
    }

    public function availableGateway(Request $request): ?array
    {
        $gateway = $this->manager->availableGateway(
            $request->country,
            $request->currency
        );

        if (!$gateway) {
            return null;
        }

        return [
            'gateway' => $gateway->getName(),
            'methods' => $gateway->getPaymentMethods(),
        ];
    }
}
