<?php

namespace App\Http\Resources;

use App\Http\Resources\ProductImageResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductVariantResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'external_id' => $this->external_id,
            'sku' => $this->sku,
            'name' => $this->name,
            'name_processed' => $this->name_processed,
            'key' => $this->key,
            'price' => $this->price,
            'stock' => $this->stock,
            'weight' => $this->weight,
            'volume' => $this->volume,
            'ai_status' => $this->ai_status,

            'image' => new ProductImageResource(
                $this->whenLoaded('image')
            ),

            'translations' => $this->translations,
        ];
    }
}
