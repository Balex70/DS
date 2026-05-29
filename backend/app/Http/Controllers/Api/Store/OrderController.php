<?php

namespace App\Http\Controllers\Api\Store;

use App\Enums\OrderDsStatusEnum;
use App\Enums\OrderStatusEnum;
use App\Enums\PaymentStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\Order;
use App\Services\CartService;
use App\Services\StoreOrderService;
use Illuminate\Http\Request;


class OrderController extends Controller
{
    public function __construct(
        private CartService $cartService,
        private StoreOrderService $storeOrderService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // should be restricted
        $orders = Order::query()
            ->where('customer_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return response()->json($orders);
    }

    /**
     * Create new order by customer (checkout)
     */
    public function store(StoreOrderRequest $request)
    {
        $data = $request->validated();

        $token = $request->attributes->get('cart_token');
        $cart = $this->cartService->get($token);
        $items = $cart['items'];
        
        if (empty($items)) {
            return response()->json(['message' => 'Cart is empty'], 422);
        }

        $order = $this->storeOrderService->storeOrder($data, $items);

        return response()->json($order->load('items'), 201);
    }

    public function shippingCalculate(Request $request)
    {
        $token = $request->attributes->get('cart_token');
        $cart = $this->cartService->get($token);
        $items = $cart['items'];

        if (empty($items)) {
            return response()->json([
                'message' => 'Cart is empty'
            ], 422);
        }

        $shippingData = $request->validate([
            'shipping_country' => 'required|string',
            'shipping_postal_code' => 'nullable|string',
        ]);

        $payload = [
            'items' => $items,
            'shippingData' => $shippingData
        ];

        $shippingOptions = $this->storeOrderService->calculateShipping($payload);

        return response()->json($shippingOptions);
    }

    /**
     * Show single order (only owner)
     */
    public function show(Request $request, Order $order)
    {
        abort_unless($order->customer_id === $request->user()->id, 403);

        return response()->json(
            $order->load('items')
        );
    }

    /**
     * Cancel order (only if not fulfilled)
     */
    public function update(UpdateOrderRequest $request, Order $order)
    {
        abort_unless($order->customer_id === $request->user()->id, 403);

        // need to move this logic into model or service
        if (in_array($order->status, [ OrderStatusEnum::FULFILLED, OrderStatusEnum::PROCESSING])) {
            return response()->json([
                'message' => 'Order cannot be canceled at this stage.',
            ], 422);
        }

        $order->update([
            'status' => OrderStatusEnum::CANCELED,
        ]);

        return response()->json($order);
    }
}
