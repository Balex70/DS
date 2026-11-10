<?php

namespace App\Jobs;

use App\Actions\CreateAppLogAction;
use App\Enums\AppLogLevelEnum;
use App\Enums\AppLogRealmEnum;
use App\Services\ProductSearchIndexer;
use Illuminate\Bus\Queueable as BusQueueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ReindexProductsJob implements ShouldQueue
{
    use BusQueueable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public function handle(ProductSearchIndexer $indexer, CreateAppLogAction $createAppLogAction): void
    {
        $createAppLogAction->execute(
            level: AppLogLevelEnum::INFO,
            realm: AppLogRealmEnum::PRODUCT,
            message: 'Products reindex started',
        );

        $indexer->reindexProducts();

        $createAppLogAction->execute(
            level: AppLogLevelEnum::SUCCESS,
            realm: AppLogRealmEnum::PRODUCT,
            message: 'Products reindex completed',
        );
    }

    public function failed(\Throwable $exception): void
    {
        app(CreateAppLogAction::class)->execute(
            level: AppLogLevelEnum::ERROR,
            realm: AppLogRealmEnum::PRODUCT,
            message: 'Products reindex failed: ' . $exception->getMessage(),
        );
    }
}
