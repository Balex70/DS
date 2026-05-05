<?php

namespace App\Dropshipping\Actions;

use App\Jobs\AiProcessImageJob;
use App\Models\ProductImage;

class AiProcessImagesProductAction
{
    public function execute(string $productId): void
    {
        // get product to enrich
        $images = ProductImage::where('product_id', $productId)->get();

        if (!$images || $images->isEmpty()) {
            return;
        }

        foreach ($images as $image) {
            $image->update([
                'status' => 'queued'
            ]);

            dispatch(new AiProcessImageJob($image->id))
                ->onQueue('ai_image_processing');
        }
    }
}
