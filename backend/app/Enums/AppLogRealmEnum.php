<?php

namespace App\Enums;

enum AppLogRealmEnum: string
{
    case CATEGORY = 'category';
    case PRODUCT = 'product';
    case ORDER = 'order';
    case SYSTEM = 'system';
    case AUTH = 'auth';
    case CRON = 'cron';
}
