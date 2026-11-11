<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FailedJobResource;
use App\Models\FailedJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class FailedJobController extends Controller
{
    public function __construct()
    {
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('viewAny', FailedJob::class);

        $query = FailedJob::query()->orderBy('id', 'desc');

        // SEARCH
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('payload', 'like', "%{$request->search}%")
                ->orWhere('exception', 'like', "%{$request->search}%")
                ->orWhere('id', 'like', "%{$request->search}%");
            });
        }

        return FailedJobResource::collection(
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
    public function destroy(FailedJob $failedJob)
    {
        Gate::authorize('delete', $failedJob);

        $failedJob->delete();

        return response()->noContent();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroyAll()
    {
        Gate::authorize('deleteAll', FailedJob::class);

        FailedJob::query()->delete();

        return response()->noContent();
    }
}
