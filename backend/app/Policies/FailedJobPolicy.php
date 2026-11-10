<?php

namespace App\Policies;

use App\Models\FailedJob;
use App\Models\User;

class FailedJobPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        if ($user->isAdministrator()) {
            return true;
        }

        return $user->can('failedjob.edit');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, FailedJob $failedJob): bool
    {
        if ($user->isAdministrator()) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function deleteAll(User $user): bool
    {
        if ($user->isAdministrator()) {
            return true;
        }

        return false;
    }
}
