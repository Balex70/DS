<?php
namespace App\Http\Controllers\Api\Store;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Payments\PaymentManager;
use App\Payments\DTO\PaymentRequestDTO;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function __construct(
        private PaymentManager $manager
    ) {}
    public function create(Request $request, Order $order)
    {
        // abort_unless($order->customer_id === $request->user()->id, 403);

        $data = $request->validate([
            'payment_method' => 'required|string',
        ]);

        $gateway = $this->manager->driver($data['payment_method']);

        $paymentResponse = $gateway->createPayment(
            new PaymentRequestDTO(
                orderId: $order->id,
                amount: $order->total,
                currency: $order->currency ?? 'USD',
                country: $order->shipping_country,
                email: $order->shipping_email,
                methods: [],
            )
        );

        // optionally store payment
        $order->payments()->create([
            'gateway' => $gateway->getName(),
            'transaction_id' => $paymentResponse->transactionId,
            'amount' => $order->total,
            'currency' => $order->currency,
            'status' => 'pending',
        ]);

        return response()->json([
            'redirect_url' => $paymentResponse->redirectUrl,
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
