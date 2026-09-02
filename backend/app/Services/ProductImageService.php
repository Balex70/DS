<?php

namespace App\Services;

use App\Models\ProductImage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class ProductImageService
{
    public function syncOriginal(
        int $productId,
        string $imageUrl,
        int $position = 0,
        ?string $type = null
    ): ProductImage {

        $existing = ProductImage::where([
            'product_id' => $productId,
            'url' => $imageUrl,
            'type' => $type,
        ])->first();

        // already exists
        if ($existing) {

            // update position if changed
            $existing->update([
                'position' => $position,
                'status' => 'queued',
            ]);

            return $existing;
        }

        // create new
        $path = $this->downloadAndStore($imageUrl, $productId);

        return ProductImage::create([
            'product_id' => $productId,
            'url' => $imageUrl, // fallback original field
            'original_url' => $path, // canonical source
            'position' => $position,
            'status' => 'queued',
            'type' => $type,
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

        return $fileName;
    }

    public function storeAiProcessed(int $productId, UploadedFile $file): string
    {
        $fileName = "products/{$productId}/ai/" . uniqid() . ".png";

        Storage::disk('public')->put($fileName, file_get_contents($file));

        return $fileName;
    }

    public function delete(string $path): bool
    {
        $path = str_replace('/storage/', '', $path);
        $path = ltrim($path, '/');

        return Storage::disk('public')->delete($path);
    }
}
