<?php

namespace App\Providers;

use App\Listeners\LogScheduledTask;
use Illuminate\Console\Events\ScheduledTaskFailed;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Event::listen(
            ScheduledTaskFailed::class,
            [LogScheduledTask::class, 'handleFailed']
        );
    }
}
