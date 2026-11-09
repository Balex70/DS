<?php

namespace App\Models;

use App\Services\ProductSearchIndexer;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

#[Fillable([
    'product_variant_id', 'locale', 'name', 'translated_at',
])]
class ProductVariantTranslation extends Model
{
    /** @use HasFactory<\Database\Factories\ProductVariantTranslationFactory> */
    use HasFactory;

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }

    protected static function booted(): void
    {
        static::saved(function (ProductVariantTranslation $translation) {
            $productId = $translation->variant?->product_id;

            if (!$productId) {
                return;
            }

            DB::afterCommit(function () use ($productId) {
                app(ProductSearchIndexer::class)
                    ->indexProduct($productId);
            });
        });

        static::deleted(function (ProductVariantTranslation $translation) {
            $productId = $translation->variant?->product_id;

            if (!$productId) {
                return;
            }

            DB::afterCommit(function () use ($productId) {
                app(ProductSearchIndexer::class)
                    ->indexProduct($productId);
            });
        });
    }
}
