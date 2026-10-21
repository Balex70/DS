<?php

namespace App\Policies;

use App\Models\QueueJob;
use App\Models\User;

class QueueJobPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        if ($user->isAdministrator()) {
            return true;
        }

        return $user->can('queuejob.edit');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, QueueJob $queueJob): bool
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
