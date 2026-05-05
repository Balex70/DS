<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Bus\Queueable as BusQueueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Dropshipping\Actions\AiProcessImagesProductAction;

class AiProcessImagesProductJob implements ShouldQueue
{
    use BusQueueable, InteractsWithQueue, Queueable, SerializesModels;
    
    public function __construct(
        public int $productId
    ) {}

    public function handle(AiProcessImagesProductAction $action): void
    {
        $action->execute($this->productId);
    }
}
