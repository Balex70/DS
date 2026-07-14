<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProductVariantRequest;
use App\Http\Resources\ProductVariantResource;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class ProductVariantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, Product $product)
    {
        Gate::authorize('viewAny', ProductVariant::class);

        $query = $product->variants->load([
            'translations'
        ]);

        return ProductVariantResource::collection(
            $query->all()
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
     * Update the specified resource in storage.
     */
    public function update(UpdateProductVariantRequest $request, ProductVariant $productVariant)
    {
        Gate::authorize('update', $productVariant);
        $data = $request->validated();

        DB::transaction(function () use ($productVariant, $data) {

            // 1. Update base productVariant fields | en
            $productVariant->update([
                'price' => $data['price'],
                'name_processed' => $data['translations']['en']['name'],
            ]);

            // 2. Sync translations
            if (!empty($data['translations'])) {
                foreach ($data['translations'] as $locale => $translation) {
                    if ($locale === 'en') {
                        continue;
                    }
                    $productVariant->translations()->updateOrCreate(
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

        return new ProductVariantResource($productVariant);
    }
}
