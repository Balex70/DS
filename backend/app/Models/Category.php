<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'name',
    'external_id',
    'parent_id',
    'provider',
])]
class Category extends Model
{
    use HasFactory;

    // Parent relation
    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    // Children relation
    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id');
    }
}
