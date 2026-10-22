<?php

namespace App\Services;

use App\Actions\CreateAppLogAction;
use App\Enums\AppLogLevelEnum;
use App\Enums\AppLogRealmEnum;
use App\Models\ProductImage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Drivers\Vips\Driver;
use Intervention\Image\Format;
use Intervention\Image\ImageManager;

class ProductImageService
{
    public function __construct(
        private CreateAppLogAction $createAppLogAction
    ) {
    }
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
            throw new \RuntimeException("Failed to download image: {$url}");
        }

        $contents = $response->body();

        $extension = strtolower(pathinfo(
            parse_url($url, PHP_URL_PATH) ?? '',
            PATHINFO_EXTENSION
        )) ?: 'bin';

        $storedContents = $contents;
        $reason = null;

        if (strlen($contents) > 20 * 1024 * 1024) {
            $reason = 'Image download exceeds 20 MiB';
        } else {
            $dimensions = @getimagesizefromstring($contents);

            if ($dimensions === false) {
                $reason = 'Downloaded file is not a valid image';
            } else {
                [$width, $height] = $dimensions;

                if (
                    $width <= 0 ||
                    $height <= 0 ||
                    $width * $height > 12_000_000
                ) {
                    $reason = "Image dimensions exceed limit: {$width}x{$height}";
                }
            }
        }

        if ($reason === null) {
            try {
                $manager = ImageManager::usingDriver(Driver::class);
                $image = $manager->decode($contents);
                $encoded = $image->encodeUsingFormat(
                    Format::AVIF,
                    quality: 75
                );

                $storedContents = (string) $encoded;
                $extension = 'avif';
            } catch (\Throwable $e) {
                $reason = 'AVIF conversion failed: ' . $e->getMessage();
                report($e);
            }
        }

        if ($reason !== null) {
            $this->createAppLogAction->execute(
                level: AppLogLevelEnum::WARNING,
                realm: AppLogRealmEnum::PRODUCT,
                message: "Product ID: {$productId} (image URL: {$url}) — {$reason}; keeping original format.",
            );
        }

        $fileName = sprintf(
            'products/%d/original/%s.%s',
            $productId,
            uniqid(),
            $extension
        );

        Storage::disk('public')->put($fileName, $storedContents);

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
