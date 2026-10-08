<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'product_id',
    'external_id',
    'sku',
    'name',
    'key',
    'cost_price',
    'price',
    'stock',
    'stock_synced_at',
    'weight',
    'volume',
    'image_id',
    'name_processed',
    'ai_status'
])]
class ProductVariant extends Model
{
    use HasFactory;

    protected $casts = [
        'stock_synced_at' => 'datetime',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class, 'product_id');
    }

    public function image(): BelongsTo
    {
        return $this->belongsTo(ProductImage::class);
    }

    public function translations()
    {
        return $this->hasMany(ProductVariantTranslation::class);
    }

    public function translation()
    {
        return $this->hasOne(ProductVariantTranslation::class);
    }

    public function stockNeedsUpdate(): bool
    {
        return $this->stock_synced_at === null
            || $this->stock_synced_at->lte(now()->subMinutes(15));
    }
}
