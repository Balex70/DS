<?php

namespace App\Http\Controllers\Api;

use App\Actions\CreateAppLogAction;
use App\Enums\AppLogLevelEnum;
use App\Enums\AppLogRealmEnum;
use App\Enums\ProductVariantAiStatusEnum;
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
    public function __construct(
        private CreateAppLogAction $createAppLogAction
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, Product $product)
    {
        Gate::authorize('viewAny', ProductVariant::class);

        $variants = $product->variants()
            ->with('translations')
            ->paginate(8);

        return ProductVariantResource::collection(
            $variants
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

    /**
     * Update the ai status for variants
     */
    public function changeAllVariantsAiStatuses(Product $product, ProductVariantAiStatusEnum $newAiStatus)
    {
        Gate::authorize('update', $product);
        $product->variants()->update([
            'ai_status' => $newAiStatus,
        ]);
        return response()->json([
            'message' => 'AI status updated successfully',
        ]);
    }

    /**
     * Remove translations for product variants
     */
    public function removeTranslations(Product $product)
    {
        Gate::authorize('update', $product);
        $product->variants()
            ->get()
            ->each(function ($variant) {
                $variant->translations()->delete();
            });

        $this->createAppLogAction->execute(
                    AppLogLevelEnum::SUCCESS,
                    AppLogRealmEnum::PRODUCT,
                    "Translations for product's all variants removed:
ID: {$product->id} ($product->name_processed)"
                );

        return response()->json([
            'message' => 'Translations for product variants removed successfully',
        ]);
    }
}
