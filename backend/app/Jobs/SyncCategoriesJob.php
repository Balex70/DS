<?php

use App\Dropshipping\Actions\SyncCategoriesAction;
use Illuminate\Contracts\Queue\ShouldQueue;

class SyncCategoriesJob implements ShouldQueue
{
    public function handle(SyncCategoriesAction $action)
    {
        $action->execute();
    }
}
