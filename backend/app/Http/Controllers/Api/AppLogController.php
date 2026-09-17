<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AppLogResource;
use App\Models\AppLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AppLogController extends Controller
{
    public function __construct() {}
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('viewAny', AppLog::class);

        $query = AppLog::query()->orderBy('id');

        // SEARCH
        if ($request->filled('search')) {
            $query->where('message', 'like', "%{$request->search}%");
        }

        if ($request->filled('levels')) {
            $levels = explode(',', $request->levels);

            $query->whereIn('level', $levels);
        }
        
        if ($request->filled('realms')) {
            $realms = explode(',', $request->realms);

            $query->whereIn('realm', $realms);
        }

        return AppLogResource::collection(
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
    public function destroy(AppLog $appLog)
    {
        Gate::authorize('delete', $appLog);

        $appLog->delete();

        return response()->noContent();
    }
}
