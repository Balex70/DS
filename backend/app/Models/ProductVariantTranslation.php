<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'product_variant_id', 'locale', 'name', 'translated_at',
])]
class ProductVariantTranslation extends Model
{
    /** @use HasFactory<\Database\Factories\ProductVariantTranslationFactory> */
    use HasFactory;
}
