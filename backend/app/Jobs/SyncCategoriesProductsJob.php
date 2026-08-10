<?php

namespace App\Jobs;

use App\Dropshipping\Actions\SyncCategoriesProductsAction;
use Illuminate\Bus\Queueable as BusQueueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SyncCategoriesProductsJob implements ShouldQueue
{
    use BusQueueable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(SyncCategoriesProductsAction $action)
    {
        $action->execute();
    }
}
