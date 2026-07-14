<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name'])]
class Material extends Model
{
    /** @use HasFactory<\Database\Factories\MaterialFactory> */
    use HasFactory;

    public function products()
    {
        return $this->belongsToMany(Product::class);
    }

    public function translations()
    {
        return $this->hasMany(MaterialTranslation::class);
    }

    public function translation()
    {
        return $this->hasOne(MaterialTranslation::class);
    }
}
