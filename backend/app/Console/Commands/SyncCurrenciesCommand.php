<?php

namespace App\Console\Commands;

use App\Jobs\SyncCurrenciesJob;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('app:sync-currencies')]
#[Description('Sync currencies')]
class SyncCurrenciesCommand extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        SyncCurrenciesJob::dispatch();

        $this->info('Sync currencies job dispatched!');
    }
}
