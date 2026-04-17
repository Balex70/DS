<?php

namespace App\Dropshipping\Services;

use App\Dropshipping\API\CjApiClient;
use App\Dropshipping\DTO\ProductDTO;

class CjProductService
{
    public function __construct(
        private CjApiClient $client
    ) {}

    public function all(): array
    {
        // map CJ response → ProductData
    }
}
