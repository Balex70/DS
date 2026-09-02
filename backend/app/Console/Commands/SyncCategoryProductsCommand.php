<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use App\Jobs\SyncCategoryProductsJob;

#[Signature('app:sync-category {categoryId}')]
#[Description('Sync category products from CJ')]
class SyncCategoryProductsCommand extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $categoryId = $this->argument('categoryId');

        SyncCategoryProductsJob::dispatch($categoryId);

        $this->info('Sync category product job dispatched!');
    }
}
