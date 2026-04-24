<?php

namespace App\Console\Commands;

use App\Jobs\EnrichProductJob;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('app:enrich-product')]
#[Description('Enrich product')]
class EnrichProductCommand extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        EnrichProductJob::dispatch();

        $this->info('Enrich product job dispatched!');
    }
}
