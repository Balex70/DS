<?php

namespace App\Services;

use App\Models\ProductImage;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class ProductImageService
{
    public function storeOriginal(int $productId, string $imageUrl, int $position = 0): ProductImage
    {
        $path = $this->downloadAndStore($imageUrl, $productId);

        return ProductImage::create([
            'product_id' => $productId,
            'url' => $imageUrl,              // fallback original field
            'original_url' => $path,     // canonical source
            'position' => $position,
            'status' => 'original',
        ]);
    }

    public function downloadAndStore(string $url, int $productId): string
    {
        $response = Http::timeout(30)->get($url);

        if (!$response->successful()) {
            throw new \Exception("Failed to download image: {$url}");
        }

        $contents = $response->body();

        $fileName = "products/{$productId}/original/" . uniqid() . ".jpg";

        Storage::disk('public')->put($fileName, $contents);

        return Storage::url($fileName);
    }
}
