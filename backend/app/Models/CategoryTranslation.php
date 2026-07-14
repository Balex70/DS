<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'category_id', 'locale', 'name', 'description', 'translated_at',
])]
class CategoryTranslation extends Model
{
    /** @use HasFactory<\Database\Factories\CategoryTranslationFactory> */
    use HasFactory;
}
