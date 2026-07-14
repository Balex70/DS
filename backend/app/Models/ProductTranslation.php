<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'product_id', 'locale', 'name', 'description', 'translated_at',
])]
class ProductTranslation extends Model
{
    /** @use HasFactory<\Database\Factories\ProductTranslationFactory> */
    use HasFactory;
}
