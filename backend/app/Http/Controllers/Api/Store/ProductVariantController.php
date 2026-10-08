<?php

namespace App\Http\Controllers\Api\Store;

use App\Http\Controllers\Controller;
use App\Models\ProductVariant;
use App\Services\ProductVariantService;

class ProductVariantController extends Controller
{
    public function __construct(
        private ProductVariantService $service
    ) {}

    /**
     * Update stock for product variant
     */
    public function stockUpdate(ProductVariant $productVariant)
    {
        $variant = $this->service->updateVariantStock($productVariant);

        if (!$variant) {
            return response()->json([
                'message' => 'Unable to update stock.',
            ], 502);
        }

        return response()->json([
            'stock' => $variant->stock
        ]);
    }
}
