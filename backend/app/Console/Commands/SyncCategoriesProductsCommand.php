<?php

namespace App\Console\Commands;

use App\Jobs\SyncCategoriesProductsJob;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;


#[Signature('app:sync-products')]
#[Description('Sync categories products from CJ (run one category per run')]
class SyncCategoriesProductsCommand extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        SyncCategoriesProductsJob::dispatch();

        $this->info('Sync categories products job dispatched!');
    }
}
