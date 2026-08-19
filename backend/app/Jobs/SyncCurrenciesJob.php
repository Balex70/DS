<?php

namespace App\Jobs;

use App\Currency\Actions\SyncCurrenciesAction;
use Illuminate\Bus\Queueable as BusQueueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SyncCurrenciesJob implements ShouldQueue
{
    use BusQueueable, InteractsWithQueue, Queueable, SerializesModels;
    public function handle(SyncCurrenciesAction $action)
    {
        $action->execute();
    }
}
