<?php

namespace App\Policies;

use App\Models\Category;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CategoryPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        if ($user->isAdministrator()) {
            return true;
        }

        return $user->can('categories.edit');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Category $category): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Category $category): bool
    {
        if ($user->isAdministrator()) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can bulk activate.
     */
    public function bulkActivate(User $user): bool
    {
        if ($user->isAdministrator()) {
            return true;
        }

        return $user->can('categories.edit');
    }
}
