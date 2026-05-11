<?php
namespace App\Enums;

enum ProductAiStatusEnum: string
{
    case QUEUED = 'queued';
    case PROCESSING = 'processing';
    case DONE = 'done';
    case FAILED = 'failed';
}
