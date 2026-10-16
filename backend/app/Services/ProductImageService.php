<?php

namespace App\Services;

use App\Models\ProductImage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Format;

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
            $oldPath = $existing->original_url;

            $needsConversion = $oldPath
            && in_array(strtolower(pathinfo($oldPath, PATHINFO_EXTENSION)), ['jpg', 'jpeg']);

            $fileMissing = !$oldPath
            || !Storage::disk('public')->exists($oldPath);

            $updates = [
                'position' => $position,
                'status' => 'queued',
            ];

            // Restore the original image if its file is missing.
            // Or if it needs conversion
            if ($fileMissing || $needsConversion) {
                $newPath = $this->downloadAndStore($imageUrl, $productId);

                $updates['original_url'] = $newPath;
            }

            $existing->update($updates);

            // delete old files
            if (
                isset($newPath)
                && $oldPath
                && $oldPath !== $newPath
                && Storage::disk('public')->exists($oldPath)
            ) {
                Storage::disk('public')->delete($oldPath);
            }

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

        $manager = ImageManager::usingDriver(Driver::class);
        $image = $manager->decode($response->body());
        $encoded = $image->encodeUsingFormat(Format::AVIF, quality: 75);

        $fileName = "products/{$productId}/original/" . uniqid() . ".avif";

        Storage::disk('public')->put($fileName, (string) $encoded);

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

    public function deleteProductImages(int $productId): void
    {
        $directory = "products/{$productId}";

        Storage::disk('public')->deleteDirectory($directory);
    }
}
