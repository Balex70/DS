<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Payment::class);
        
        $query = Payment::query()
            ->with(['order.items'])
            ->when($request->status, fn ($q) =>
                $q->where('status', $request->status)
            )
            ->when($request->gateway, fn ($q) =>
                $q->where('gateway', $request->gateway)
            )
            ->when($request->search, function ($q) use ($request) {
                $search = $request->search;

                $q->where(function ($query) use ($search) {
                    $query->where('transaction_id', 'ILIKE', "%{$search}%")
                        ->orWhere('gateway', 'ILIKE', "%{$search}%");
                });
            })
            ->latest();

        return PaymentResource::collection(
            $query->paginate(10)
        );
    }
}
