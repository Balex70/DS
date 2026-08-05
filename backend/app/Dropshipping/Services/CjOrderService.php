<?php
namespace App\Dropshipping\Services;

use App\Dropshipping\API\CjApiClient;
use App\Dropshipping\Mappers\CjOrderMapper;

class CjOrderService
{
    public function __construct(
        private CjApiClient $client,
        private CjOrderMapper $mapper
    ) {}

    public function create(array $payload): array
    {
        $cjPayload = $this->mapper->map($payload);

        return $this->client->createOrder($cjPayload);
    }

    public function checkStatus(int $orderId): array
    {
        return $this->client->checkOrderStatus($orderId);
    }

    public function trackInfo(int $trackNumber): array
    {
        return $this->client->getTrackInfo($trackNumber);
    }
}
