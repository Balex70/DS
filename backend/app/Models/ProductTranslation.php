<?php

namespace App\Models;

use App\Services\ProductSearchIndexer;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

#[Fillable([
    'product_id', 'locale', 'name', 'description', 'translated_at',
])]
class ProductTranslation extends Model
{
    /** @use HasFactory<\Database\Factories\ProductTranslationFactory> */
    use HasFactory;

    protected $casts = [
        'translated_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::saved(function (ProductTranslation $translation) {
            $productId = $translation->product_id;

            DB::afterCommit(function () use ($productId) {
                app(ProductSearchIndexer::class)
                    ->indexProduct($productId);
            });
        });

        static::deleted(function (ProductTranslation $translation) {
            $productId = $translation->product_id;

            DB::afterCommit(function () use ($productId) {
                app(ProductSearchIndexer::class)
                    ->indexProduct($productId);
            });
        });
    }
}
