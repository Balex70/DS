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
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function __construct(
        private CartService $cartService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
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

        // TODO: move it into service
        // Calculate totals server-side (IMPORTANT)
        $subtotal = collect($items)->sum(fn ($item) => $item['price'] * $item['quantity']);
        $shipping = $data['shipping_cost'] ?? 0;
        $total = $subtotal + $shipping;
        $customer = auth('customer')->user();

        $order = Order::create([
            'order_number' => 'ORD-' . strtoupper(Str::random(10)),

            'customer_id' => $customer ? $customer->id : null,

            'subtotal' => $subtotal,
            'shipping_cost' => $shipping,
            'total' => $total,

            'currency' => $data['currency'] ?? 'USD',

            'ds_provider' => $data['ds_provider'] ?? 'cj',
            'ds_status' => OrderDsStatusEnum::PENDING,

            'status' => OrderStatusEnum::PENDING,
            'payment_status' => PaymentStatusEnum::UNPAID,

            'payment_method' => $data['payment_method'] ?? null,

            'shipping_full_name' => $data['shipping_full_name'],
            'shipping_phone' => $data['shipping_phone'] ?? null,
            'shipping_email' => $data['shipping_email'] ?? null,

            'shipping_address_line1' => $data['shipping_address_line1'],
            'shipping_address_line2' => $data['shipping_address_line2'] ?? null,
            'shipping_city' => $data['shipping_city'],
            'shipping_state' => $data['shipping_state'] ?? null,
            'shipping_postal_code' => $data['shipping_postal_code'] ?? null,
            'shipping_country' => $data['shipping_country'],

            'notes' => $data['notes'] ?? null,
        ]);

        // Create order items
        foreach ($items as $item) {
            $order->items()->create([
                'product_id' => $item['product_id'] ?? null,
                'title' => $item['title'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
                'total' => $item['price'] * $item['quantity'],
                'variant_data' => $item['variant_data'] ?? null,
            ]);
        }

        return response()->json($order->load('items'), 201);
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
