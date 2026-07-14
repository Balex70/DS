<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'material_id', 'locale', 'name', 'translated_at',
])]
class MaterialTranslation extends Model
{
    /** @use HasFactory<\Database\Factories\MaterialTranslationFactory> */
    use HasFactory;
}
