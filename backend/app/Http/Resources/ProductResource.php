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
                return new ProductImageResource($image);
            }),
            'variants' => ProductVariantResource::collection(
                $this->whenLoaded('variants')
            ),
            'translations' => $this->translations
        ];
    }
}
