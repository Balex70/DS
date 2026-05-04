<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable([
    'product_id', 'url', 'original_url',
    'position', 'status'
])]
class ProductImage extends Model
{
    //
}
