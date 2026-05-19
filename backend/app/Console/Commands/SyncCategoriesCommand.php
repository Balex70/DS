<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use App\Jobs\SyncCategoriesJob;

#[Signature('app:sync-categories')]
#[Description('Command description')]
class SyncCategoriesCommand extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        SyncCategoriesJob::dispatch();

        $this->info('Sync job dispatched!');
    }
}
