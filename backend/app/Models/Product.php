<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name_raw', 'name_processed', 'description_raw', 'price'])]
class Product extends Model
{
    protected $casts = [
        'raw_data' => 'array',
    ];
}
