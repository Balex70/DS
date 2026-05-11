<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $product = parent::toArray($request);
        return [
            ...$product,
            'images' => $this->images->map(function ($image) {
                return [
                    'id' => $image->id,
                    'url' => $image->url,
                    'original_url' => $image->original_url,
                    'ai_url' => $image->ai_url,
                    'position' => $image->position,
                    'status' => $image->status,
                ];
            }),
        ];
    }
}
