<?php
namespace App\Enums;

enum ProductVariantAiStatusEnum: string
{
    case QUEUED = 'queued';
    case PROCESSING = 'processing';
    case DONE = 'done';
    case FAILED = 'failed';
}
