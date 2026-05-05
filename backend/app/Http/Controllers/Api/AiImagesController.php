<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;

class AiImagesController extends Controller
{
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

        // TODO: send nameEN to AI also
        return response()->json([
            'id' => $image->id,
            'image_url' => $image->original_url,
            'product_id' => $image->product_id,
        ]);
    }
    
    public function complete($id, Request $request)
    {
        $image = ProductImage::findOrFail($id);

        $image->update([
            'ai_url' => $request->ai_url,
            'status' => 'done',
            'ai_processed_at' => now(),
        ]);

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
