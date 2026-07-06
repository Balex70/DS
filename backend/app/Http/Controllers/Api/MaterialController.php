<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateMaterialRequest;
use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMaterialRequest $request, Material $material)
    {
        Gate::authorize('update', $material);
        $data = $request->validated();

        DB::transaction(function () use ($material, $data) {

            // 1. Update base material fields | en
            $material->update([
                'name' => $data['translations']['en']['name'],
            ]);

            // 2. Sync translations
            if (!empty($data['translations'])) {
                foreach ($data['translations'] as $locale => $translation) {
                    if ($locale === 'en') {
                        continue;
                    }
                    $material->translations()->updateOrCreate(
                        [
                            'locale' => $locale,
                        ],
                        [
                            'name' => $translation['name'],
                        ]
                    );
                }
            }
        });

        return response()->json(['message' => 'Material updated successfully'], 200);
    }
}
