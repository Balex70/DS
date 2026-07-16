<?php

namespace App\Http\Controllers\Api\Store;

use App\Enums\CurrenciesEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
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

        $order = $this->storeOrderService->upsertOrderByCheckoutToken($data, $items, $token);

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

        if($request->filled('currency') && $request->currency !== CurrenciesEnum::USD->value) {
            return $this->storeOrderService->calculateShipping($payload, $request->currency);
        }

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

    public function showByPublicToken(string $token)
    {
        $order = Order::query()
            ->where('public_token', $token)
            ->firstOrFail();

        return response()->json($order);
    }
}
