<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('app:sync-products')
    ->everyMinute()
    ->withoutOverlapping();

Schedule::command('app:enrich-product')
    ->everyFiveMinutes()
    ->withoutOverlapping();

Schedule::command('app:sync-currencies')
    ->twiceDaily(1, 12)
    ->withoutOverlapping();
