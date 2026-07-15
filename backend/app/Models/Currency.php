<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['from_currency', 'to_currency', 'rate', 'rate_updated_at'])]
class Currency extends Model
{
    /** @use HasFactory<\Database\Factories\CurrencyFactory> */
    use HasFactory;

    protected $casts = [
        'rate_updated_at' => 'datetime',
    ];
}
