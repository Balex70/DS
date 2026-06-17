<?php

namespace App\Http\Controllers\Api;

use App\Enums\OrderStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class OrderController extends Controller
{
    public function __construct(private OrderService $service) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Order::class);

        $orders = Order::query()
            ->with(['items'])
            ->when($request->status, fn ($q) =>
                $q->where('status', $request->status)
            )
            ->when($request->paymentStatus, fn ($q) =>
                $q->where('payment_status', $request->paymentStatus)
            )
            ->when($request->dsStatus, fn ($q) =>
                $q->where('ds_status', $request->dsStatus)
            )
            ->when($request->search, function ($q) use ($request) {
                $search = $request->search;

                $q->where(function ($query) use ($search) {
                    $query->where('order_number', 'ILIKE', "%{$search}%")
                        ->orWhere('shipping_email', 'ILIKE', "%{$search}%")
                        ->orWhere('shipping_full_name', 'ILIKE', "%{$search}%")
                        ->orWhere('shipping_country', 'ILIKE', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(10);

        return OrderResource::collection($orders);
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        Gate::authorize('view', $order);

        return response()->json(
            $order->load(['items'])
        );
    }

    public function sendOrder(Order $order)
    {
        // check if order can be send
        $canBeSend = $order->canBeSendToDsProvider();

        if (!$canBeSend['allowed']) {
            return response()->json($canBeSend, 422);
        }

        $order->load('items');

        $this->service->sendOrder($order);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrderRequest $request, Order $order)
    {
        Gate::authorize('update', $order);

        $data = $request->validated();

        // Update only allowed admin fields
        $order->update($data);

        return response()->json([
            'message' => 'Order updated successfully',
            'data' => $order->fresh()->load('items'),
        ]);
    }

    /**
     * Delete order (soft delete)
     */
    public function destroy(Order $order)
    {
        Gate::authorize('delete', $order);

        // Safety check: prevent deleting CJ orders
        if (
            $order->status === OrderStatusEnum::PENDING ||
            $order->status === OrderStatusEnum::PAID ||
            $order->status === OrderStatusEnum::PROCESSING ||
            $order->status === OrderStatusEnum::SHIPPED ||
            $order->status === OrderStatusEnum::DELIVERED) {
            return response()->json([
                'message' => 'Cannot delete order with status ' . $order->status . '.',
            ], 422);
        }

        $order->delete();

        return response()->json([
            'message' => 'Order deleted successfully',
        ]);
    }
}
