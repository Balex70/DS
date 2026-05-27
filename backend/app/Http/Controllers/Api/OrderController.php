<?php

namespace App\Http\Controllers\Api;

use App\Enums\OrderStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $orders = Order::query()
            ->with(['items'])
            ->when($request->status, fn ($q) =>
                $q->where('status', $request->status)
            )
            ->when($request->payment_status, fn ($q) =>
                $q->where('payment_status', $request->payment_status)
            )
            ->when($request->search, fn ($q) =>
                $q->where('order_number', 'like', "%{$request->search}%")
            )
            ->latest()
            ->paginate(20);

        return response()->json($orders);
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        return response()->json(
            $order->load(['items'])
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrderRequest $request, Order $order)
    {
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
        // Safety check: prevent deleting fulfilled CJ orders
        if ($order->status === OrderStatusEnum::FULFILLED) {
            return response()->json([
                'message' => 'Cannot delete fulfilled orders.',
            ], 422);
        }

        $order->delete();

        return response()->json([
            'message' => 'Order deleted successfully',
        ]);
    }
}
