<?php

namespace App\Models;

use App\Enums\AppLogLevelEnum;
use App\Enums\AppLogRealmEnum;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'level',
    'realm',
    'message',
])]
class AppLog extends Model
{
    protected function casts(): array
    {
        return [
            'level' => AppLogLevelEnum::class,
            'realm' => AppLogRealmEnum::class,
        ];
    }
}
