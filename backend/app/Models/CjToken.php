<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'access_token',
    'refresh_token',
    'access_expires_at',
    'refresh_expires_at',
    'updated_at'
])]
class CjToken extends Model
{
    use HasFactory;
    protected function casts(): array
    {
        return [
            'access_expires_at' => 'datetime',
            'refresh_expires_at' => 'datetime',
        ];
    }
}
