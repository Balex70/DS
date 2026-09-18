<?php

namespace App\Listeners;

use App\Actions\CreateAppLogAction;
use App\Enums\AppLogLevelEnum;
use App\Enums\AppLogRealmEnum;
use Illuminate\Console\Events\ScheduledTaskFailed;

class LogScheduledTask
{
    public function __construct(
        private CreateAppLogAction $createAppLogAction
    ) {}

    public function handleFailed(ScheduledTaskFailed $event): void
    {
        $this->createAppLogAction->execute(
            AppLogLevelEnum::ERROR,
            AppLogRealmEnum::CRON,
            "Cron task failed: {$event->task->command}: {$event->exception->getMessage()}"
        );
    }
}
