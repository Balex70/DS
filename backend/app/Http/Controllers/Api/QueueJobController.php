<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\QueueJobResource;
use App\Models\QueueJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class QueueJobController extends Controller
{
    public function __construct() {}
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('viewAny', QueueJob::class);

        $query = QueueJob::query()->orderBy('id', 'desc');

        // SEARCH
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('payload', 'like', "%{$request->search}%")
                ->orWhere('id', 'like', "%{$request->search}%");
            });
        }

        return QueueJobResource::collection(
            $query->paginate(10)
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(QueueJob $queueJob)
    {
        Gate::authorize('delete', $queueJob);

        $queueJob->delete();

        return response()->noContent();
    }
}
