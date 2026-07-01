<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'product_id',
    'external_id',
    'sku',
    'name',
    'key',
    'price',
    'stock',
    'weight',
    'volume',
    'image_id',
    'name_processed',
    'ai_status'
])]
class ProductVariant extends Model
{
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function image(): BelongsTo
    {
        return $this->belongsTo(ProductImage::class);
    }

    public function translations()
    {
        return $this->hasMany(ProductVariantTranslation::class);
    }
}
