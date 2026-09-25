<?php
namespace App\Enums;

enum ProductWebhookStatusEnum: string
{
    case SUCCESS = 'success';
    case RECHECK = 'recheck';
    case FAILED = 'failed';
}
