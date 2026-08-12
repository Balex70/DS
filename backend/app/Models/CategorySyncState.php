<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['category_id', 'page', 'last_run_at', 'finished'])]
class CategorySyncState extends Model
{
    use HasFactory;
    //
    
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
