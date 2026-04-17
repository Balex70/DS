<?php

use App\Dropshipping\Actions\SyncProductsAction;
use Illuminate\Contracts\Queue\ShouldQueue;

class SyncProductsJob implements ShouldQueue
{
    public function handle(SyncProductsAction $action)
    {
        $action->execute();
    }
}
