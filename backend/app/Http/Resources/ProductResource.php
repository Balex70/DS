<?php

namespace App\Http\Resources;

use App\Models\Category;
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
        $currency = $request->currency ?? null;
        return [
            ...$product,
            'currency_price' => $this->currency_price,
            'images' => $this->images->map(function ($image) {
                return new ProductImageResource($image);
            }),
            'variants' => ProductVariantResource::collection(
                $this->whenLoaded('variants')
            ),
            'translations' => $this->translations,
            'categories' => $this->categories->map(fn (Category $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'full_path' => $category->full_path,
            ]),
        ];
    }
}
