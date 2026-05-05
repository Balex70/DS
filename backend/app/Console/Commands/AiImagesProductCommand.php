<?php

namespace App\Console\Commands;

use App\Jobs\AiProcessImagesProductJob;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('app:ai-images-product-command {productId}')]
#[Description('Dispatch job to process images in AI (ComfyUI) for products')]
class AiImagesProductCommand extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $productId = $this->argument('productId');

        AiProcessImagesProductJob::dispatch($productId);

        $this->info('Ai process images for product job dispatched!');
    }
}
