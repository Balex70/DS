<?php

namespace App\Dropshipping\Services;

use App\Dropshipping\API\CjApiClient;
use App\Dropshipping\Mappers\CjCategoryMapper;

class CjCategoryService
{
    public function __construct(
        private CjApiClient $client,
        private CjCategoryMapper $mapper
    ) {}

    public function all(): array
    {
        $data = $this->client->getCategories();

        return $this->mapper->map($data);
    }
}
