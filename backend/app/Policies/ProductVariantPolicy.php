<?php

namespace App\Policies;

use App\Models\ProductVariant;
use App\Models\User;

class ProductVariantPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        if ($user->isAdministrator()) {
            return true;
        }

        return $user->can('products.edit');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ProductVariant $productVariant): bool
    {
        if ($user->isAdministrator()) {
            return true;
        }

        return $user->can('products.edit');
    }
}
