<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable([
    'name_raw', 'name_processed', 'description_raw',
    'price', 'now_price', 'suggested_price',
    'add_mark_status', 'raw_data',
    'is_collect', 'warehouse_inventory_num',
    'last_enrichment_at'
])]
class Product extends Model
{
    protected $casts = [
        'raw_data' => 'array',
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
}
