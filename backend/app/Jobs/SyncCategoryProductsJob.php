<?php

namespace App\Jobs;

use App\Dropshipping\Actions\SyncCategoryProductsAction;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Bus\Queueable as BusQueueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SyncCategoryProductsJob implements ShouldQueue
{
    use BusQueueable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public string $categoryId
    ) {}
    public function handle(SyncCategoryProductsAction $action)
    {
        $action->execute($this->categoryId);
    }
}
