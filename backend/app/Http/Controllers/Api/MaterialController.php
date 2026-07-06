<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class MaterialController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Material::class);
        
        $query = Material::query()
            ->with(['translations'])
            ->latest();

        return response()->json(
            $query->paginate(10)
        );
    }
}
