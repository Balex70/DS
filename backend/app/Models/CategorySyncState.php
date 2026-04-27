<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['category_id', 'page', 'last_run_at', 'finished'])]
class CategorySyncState extends Model
{
    //
}
