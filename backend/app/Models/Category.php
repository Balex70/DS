<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

#[Fillable([
    'name',
    'description',
    'external_id',
    'parent_id',
    'provider',
    'slug',
    'image',
    'full_path',
    'active',
    'is_visible',
    'meta_title',
    'meta_description'
])]
class Category extends Model
{
    use HasFactory;

    // Parent relation
    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    // Children relation
    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class);
    }

    public function syncState(): HasOne
    {
        return $this->hasOne(CategorySyncState::class);
    }

    protected static function booted()
    {
        static::creating(function ($category) {
            if (!$category->slug) {
                $category->slug = static::generateUniqueSlug($category->name, $category->parent_id);
            }
        });

        static::updating(function ($category) {
            if ($category->isDirty('name') && !$category->isDirty('slug')) {
                $category->slug = static::generateUniqueSlug($category->name, $category->parent_id, $category->id);
            }
        });
    }

    public static function generateUniqueSlug(
        string $name,
        ?int $parentId = null,
        ?int $ignoreId = null
    ): string {
        $slug = Str::slug($name);
        $original = $slug;
        $i = 1;

        while (
            static::where('slug', $slug)
                ->where('parent_id', $parentId)
                ->when(
                    $ignoreId,
                    fn ($q) => $q->where('id', '!=', $ignoreId)
                )
                ->exists()
        ) {
            $slug = $original . '-' . $i++;
        }

        return $slug;
    }

    public function translations()
    {
        return $this->hasMany(CategoryTranslation::class);
    }

    public function translation()
    {
        return $this->hasOne(CategoryTranslation::class);
    }
}
