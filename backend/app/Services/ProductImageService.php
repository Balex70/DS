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
            $oldThumbnailPath = $existing->thumbnail_url;

            $needsConversion = $oldPath
            && strtolower(pathinfo($oldPath, PATHINFO_EXTENSION)) !== 'avif';

            $fileMissing = !$oldPath
            || !Storage::disk('public')->exists($oldPath);

            $thumbnailMissing = !$oldThumbnailPath
            || !Storage::disk('public')->exists($oldThumbnailPath);

            $updates = [
                'position' => $position,
                'status' => 'queued',
            ];

            // Restore the original image if its file is missing.
            // Or if it needs conversion
            if ($fileMissing || $needsConversion || $thumbnailMissing) {
                [$newPath, $newThumbnailPath] = $this->downloadAndStore(
                    $imageUrl,
                    $productId
                );

                $updates['original_url'] = $newPath;
                $updates['thumbnail_url'] = $newThumbnailPath;
            }

            $existing->update($updates);

            // delete old files
            foreach ([
                $oldPath,
                $oldThumbnailPath,
            ] as $oldFile) {
                if (
                    isset($newPath)
                    && $oldFile
                    && !in_array($oldFile, [$newPath, $newThumbnailPath], true)
                    && Storage::disk('public')->exists($oldFile)
                ) {
                    Storage::disk('public')->delete($oldFile);
                }
            }

            return $existing->refresh();
        }

        // create new
        [$imagePath, $thumbnailPath] = $this->downloadAndStore($imageUrl, $productId);

        return ProductImage::create([
            'product_id' => $productId,
            'url' => $imageUrl, // fallback original field
            'original_url' => $imagePath, // canonical source
            'thumbnail_url' => $thumbnailPath,
            'position' => $position,
            'status' => 'queued',
            'type' => $type,
        ]);
    }

    public function downloadAndStore(string $url, int $productId): array
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

        $imageContents = $contents;
        $thumbnailContents = null;
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
                $thumbnailImage = $manager->decode($contents);

                // Resize oversized images while preserving aspect ratio.
                if ($image->width() > 600 || $image->height() > 600) {
                    $image->scaleDown(width: 600, height: 600);
                }

                // Resize image for thumbnail
                $thumbnailImage->scaleDown(width: 100, height: 100);

                $encoded = $image->encodeUsingFormat(
                    Format::AVIF,
                    quality: 75
                );

                $encodedThumbnail = $thumbnailImage->encodeUsingFormat(
                    Format::AVIF,
                    quality: 25
                );

                $imageContents = (string) $encoded;
                $thumbnailContents = (string) $encodedThumbnail;

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

        $imageFileName = sprintf(
            'products/%d/original/%s.%s',
            $productId,
            uniqid(),
            $extension
        );

        $thumbnailFileName = sprintf(
            'products/%d/thumbnails/%s.%s',
            $productId,
            uniqid(),
            $extension
        );

        Storage::disk('public')->put($imageFileName, $imageContents);

        if ($thumbnailContents !== null) {
            Storage::disk('public')->put($thumbnailFileName, $thumbnailContents);
        }

        return [
            $imageFileName,
            $thumbnailContents !== null ? $thumbnailFileName : null,
        ];
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
