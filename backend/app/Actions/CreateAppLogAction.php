<?php

namespace App\Actions;

use App\Enums\AppLogLevelEnum;
use App\Enums\AppLogRealmEnum;
use App\Models\AppLog;

class CreateAppLogAction
{
    public function execute(
        AppLogLevelEnum $level,
        AppLogRealmEnum $realm,
        string $message,
    ): AppLog {
        return AppLog::create([
            'level' => $level,
            'realm' => $realm,
            'message' => $message,
        ]);
    }
}
