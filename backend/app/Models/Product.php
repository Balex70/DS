<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'name_raw', 'name_processed', 'description_raw',
    'price', 'now_price', 'suggested_price',
    'big_image', 'add_mark_status', 'raw_data',
    'is_collect', 'warehouse_inventory_num',
    'last_enrichment_at'
])]
class Product extends Model
{
    protected $casts = [
        'raw_data' => 'array',
    ];

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }
}
