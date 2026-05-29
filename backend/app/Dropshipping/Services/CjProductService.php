<?php

namespace App\Dropshipping\Services;

use App\Dropshipping\API\CjApiClient;
use App\Dropshipping\Mappers\CjProductMapper;
use Illuminate\Support\Str;

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

    public function getProductDetails(string $externalProductId): array
    {
        $data = $this->client->getProductDetails($externalProductId);

        if (!isset($data) || empty($data)) {
            return [];
        }

        return $data;
    }

    public function calculateShipping(array $payload): array
    {
        $cjShippingPayload = [
            'startCountryCode' => 'CN',
            'endCountryCode' => $payload['shippingData']['shipping_country'],
            'products' => array_map(function ($item) {
                return [
                    'vid' => "1383296520174047232",
                    'quantity' => $item['quantity'],
                ];
            }, $payload['items']),
        ];

        $shippingOptions = $this->client->calculateShipping($cjShippingPayload);

        return array_map(function ($item) {
            return [
                'id' => Str::slug($item['logisticName']),
                'name' => $item['logisticName'],
                'price' => (int) round($item['logisticPrice'] * 100),
                'estimated_delivery' => $item['logisticAging'],
            ];
        }, $shippingOptions);
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
