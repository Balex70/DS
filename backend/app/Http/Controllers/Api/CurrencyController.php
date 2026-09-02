<?php

namespace App\Http\Controllers\Api;

use App\Currency\CurrencyManager;
use App\Http\Controllers\Controller;
use App\Http\Resources\CurrencyResource;
use App\Models\Currency;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CurrencyController extends Controller
{
    public function __construct(
        private CurrencyManager $manager
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Currency::class);

        return CurrencyResource::collection(
            Currency::all()
        );
    }
    
    public function syncRate()
    {
        $this->manager->syncRate();
    }
}
