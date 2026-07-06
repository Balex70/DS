<?php

namespace App\Policies;

use App\Models\User;

class MaterialPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        if ($user->isAdministrator()) {
            return true;
        }

        return $user->can('materials.edit');
    }
}
