<?php

namespace App\Jobs;

use App\Dropshipping\Actions\SyncCategoriesAction;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Bus\Queueable as BusQueueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SyncCategoriesJob implements ShouldQueue
{
    use BusQueueable, InteractsWithQueue, Queueable, SerializesModels;
    public function handle(SyncCategoriesAction $action)
    {
        $action->execute();
    }
}
