<?php

namespace App\Dropshipping\Services;

use App\Dropshipping\API\CjApiClient;

class CjSubscriptionService
{
    public function __construct(
        private CjApiClient $client
    ) {}

    public function setProductsWebhooks(string $typeStatus): array
    {
        return $this->client->setProductsWebhooks($typeStatus);
    }
}
