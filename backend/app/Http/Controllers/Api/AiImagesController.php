<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Services\ProductImageService;
use Illuminate\Http\Request;

class AiImagesController extends Controller
{
    public function __construct(protected ProductImageService $imageService)
    {}
    public function next()
    {
        $image = ProductImage::where('status', 'queued')
            ->orderBy('id')
            ->first();

        if (!$image) {
            return response()->json(null, 204);
        }

        $image->update([
            'status' => 'processing'
        ]);

        return response()->json([
            'id' => $image->id,
            'image_url' => asset($image->original_url),
            'product_id' => $image->product_id,
            'product_name' => $image->product->name_raw,
        ]);
    }
    
    public function complete($id, Request $request)
    {
        $image = ProductImage::findOrFail($id);
        $oldPath = $image->ai_url;

        $file = $request->file('image');

        $path = $this->imageService->storeAiProcessed($image->product_id, $file);

        $image->update([
            'ai_url' => $path,
            'status' => 'done',
            'ai_processed_at' => now(),
        ]);

        // delete old file AFTER successful update
        if ($oldPath) {
            $this->imageService->delete($oldPath);
        }
        $pending = ProductImage::where('product_id', $image->product_id)
            ->where('status', '!=', 'done')
            ->exists();

        if (!$pending) {
            Product::where('id', $image->product_id)
                ->update(['ai_images_at' => now()]);
        }

        return response()->json(['ok' => true]);
    }
}
