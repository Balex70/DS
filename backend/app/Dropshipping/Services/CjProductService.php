<?php

namespace App\Dropshipping\Services;

use App\Dropshipping\API\CjApiClient;
use App\Dropshipping\Mappers\CjProductMapper;

class CjProductService
{
    public function __construct(
        private CjApiClient $client,
        private CjProductMapper $mapper
    ) {}

    public function all(): array
    {
        // map CJ response → ProductData
    }

    public function get(string $categoryId, int $page, int $size = 10): array
    {
        $data = $this->client->getProducts($categoryId, $page, $size);

        $productList = $data['content'][0]['productList'] ?? [];

        if (empty($productList)) {
            return [
                'products' => [],
                'pagination' => $this->extractPagination($data),
            ];
        }

        $products = array_map(
            fn ($item) => $this->mapper->mapFromList($item),
            $productList
        );

        return [
            'products' => $products,
            'pagination' => $this->extractPagination($data),
        ];
    }

    private function extractPagination(array $data): array
    {
        return [
            'page' => $data['pageNumber'] ?? 1,
            'page_size' => $data['pageSize'] ?? 0,
            'total_pages' => $data['totalPages'] ?? 0,
            'total_records' => $data['totalRecords'] ?? 0,
        ];
    }
}
