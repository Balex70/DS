<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'product_id',
    'external_id',
    'sku',
    'name',
    'key',
    'price',
    'stock',
    'weight',
    'volume',
    'image_id'
])]
class ProductVariant extends Model
{
    //
}
