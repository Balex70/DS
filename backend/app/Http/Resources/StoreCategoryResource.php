<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StoreCategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'parent_id' => $this->parent_id,
            'provider' => $this->provider,
            'active' => $this->active,
            'slug' => $this->slug,
            'image' => $this->image,
            'full_path' => $this->full_path,
            'translations' => $this->translations,
            'products' => ProductResource::collection(
                $this->whenLoaded('products')
            )
        ];
        // return parent::toArray($request);
    }
}
