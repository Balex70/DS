<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'product_id', 'url', 'original_url',
    'position', 'status', 'ai_url', 'type'
])]
class ProductImage extends Model
{
    use HasFactory;
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
