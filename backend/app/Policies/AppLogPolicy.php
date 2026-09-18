<?php

namespace App\Policies;

use App\Models\AppLog;
use App\Models\User;

class AppLogPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        if ($user->isAdministrator()) {
            return true;
        }

        return $user->can('applog.edit');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, AppLog $appLog): bool
    {
        if ($user->isAdministrator()) {
            return true;
        }

        return false;
    }
}
