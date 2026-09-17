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

        // // SEARCH
        // if ($request->filled('search')) {
        //     $query->where('name_raw', 'like', "%{$request->search}%");
        // }

        // if ($request->filled('categoryIds')) {
        //     $categoryIds = explode(',', $request->categoryIds);

        //     $query->whereHas('categories', function ($q) use ($categoryIds) {
        //         $q->whereIn('categories.id', $categoryIds);
        //     });
        // }

        // $outdatedDate = now()->subWeeks(8);
        // // ENRICHED FILTER
        // if ($request->filled('enriched')) {
        //     $query
        //         ->whereNotNull('last_enrichment_at')
        //         ->where('last_enrichment_at', '>', $outdatedDate);
        // }

        // // OUTDATED FILTER
        // if ($request->filled('outdated')) {
        //     $query->where(function ($q) use ($outdatedDate) {
        //         $q->whereNull('last_enrichment_at')
        //         ->orWhere('last_enrichment_at', '<', $outdatedDate);
        //     })
        //     ->whereNull('enrichment_failed_at');
        // }

        // // ENRICHMENT FAILED FILTER
        // if ($request->filled('enrichedFailed')) {
        //     $query->whereNotNull('enrichment_failed_at');
        // }

        // // AI TEXTS FILTER
        // if ($request->filled('aiTextsProcessed')) {
        //     $query->whereNotNull('ai_texts_at');
        // }

        // // AI IMAGES FILTER
        // if ($request->filled('aiImagesProcessed')) {
        //     $query->whereNotNull('ai_images_at');
        // }

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
