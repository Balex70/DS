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
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'parent_id' => $this->parent_id,
            'provider' => $this->provider,
            'active' => $this->active,
            'is_visible' => $this->is_visible,
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
