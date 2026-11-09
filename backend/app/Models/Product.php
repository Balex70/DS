<?php

namespace App\Models;

use App\Models\Material;
use App\Services\ProductImageService;
use App\Services\ProductSearchIndexer;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\DB;

#[Fillable([
    'name_raw', 'name_processed', 'description_raw',
    'sku', 'product_weight', 'packing_weight',
    'cost_price', 'price', 'now_price', 'suggested_price',
    'add_mark_status', 'raw_data',
    'is_collect', 'warehouse_inventory_num',
    'last_enrichment_at', 'description_processed',
    'enrichment_failed_at', 'enrichment_error',
    'ai_texts_at', 'ai_status'
])]
class Product extends Model
{
    use HasFactory;

    protected bool $skipSearchIndexing = false;

    protected $casts = [
        'raw_data' => 'array',
        'last_enrichment_at' => 'datetime',
        'ai_texts_at' => 'datetime',
        'enrichment_failed_at' => 'datetime',
    ];

    protected $with = ['images', 'bigImage'];

    public function bigImage(): HasOne
    {
        return $this->hasOne(ProductImage::class)->where('type', 'big');
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function materials()
    {
        return $this->belongsToMany(Material::class);
    }

    public function cheapestVariant(): HasOne
    {
        return $this->hasOne(ProductVariant::class)
            ->ofMany('price', 'min')
            ->with('image');
    }

    public function translations()
    {
        return $this->hasMany(ProductTranslation::class);
    }

    public function translation()
    {
        return $this->hasOne(ProductTranslation::class);
    }

    public function hasOrders(): bool
    {
        return $this->variants()
            ->whereHas('orderItems')
            ->exists();
    }

    public function skipSearchIndexing(bool $skip = true): void
    {
        $this->skipSearchIndexing = $skip;
    }

    protected static function booted(): void
    {
        static::deleting(function (Product $product) {
            app(ProductImageService::class)->deleteProductImages($product->id);
        });

        static::saved(function (Product $product) {
            if ($product->skipSearchIndexing) {
                return;
            }

            $productId = $product->id;

            DB::afterCommit(function () use ($productId) {
                app(ProductSearchIndexer::class)->indexProduct($productId);
            });
        });

        static::deleted(function (Product $product) {
            $productId = $product->id;

            DB::afterCommit(function () use ($productId) {
                app(ProductSearchIndexer::class)
                    ->deleteProduct($productId);
            });
        });
    }
}
