<?php

namespace Tests\Feature\Dropshipping;

use App\Dropshipping\API\CjApiClient;
use App\Dropshipping\Mappers\CjProductMapper;
use App\Dropshipping\Services\CjProductService;
use Tests\TestCase;

class CjProductServiceTest extends TestCase
{
    public function test_returns_empty_products_when_api_has_no_products()
    {
        $apiResponse = [
            'pageNumber' => 1,
            'pageSize' => 10,
            'totalPages' => 0,
            'totalRecords' => 0,
            'content' => [
                [
                    'productList' => []
                ]
            ]
        ];

        $client = $this->mock(CjApiClient::class);
        $client->shouldReceive('getProducts')
            ->once()
            ->with('123', 1, 10)
            ->andReturn($apiResponse);

        $mapper = $this->mock(CjProductMapper::class);
        $mapper->shouldNotReceive('mapFromList');

        $this->app->instance(CjApiClient::class, $client);
        $this->app->instance(CjProductMapper::class, $mapper);

        $service = $this->app->make(CjProductService::class);

        $result = $service->get('123', 1, 10);

        $this->assertEquals([
            'products' => [],
            'pagination' => [
                'page' => 1,
                'page_size' => 10,
                'total_pages' => 0,
                'total_records' => 0,
            ],
        ], $result);
    }
    
    public function test_returns_mapped_products()
    {
        $apiResponse = [
            'pageNumber' => 1,
            'pageSize' => 10,
            'totalPages' => 5,
            'totalRecords' => 50,
            'content' => [
                [
                    'productList' => [
                        ['id' => 'p1'],
                        ['id' => 'p2'],
                    ]
                ]
            ]
        ];

        $mappedProducts = [
            ['id' => 'p1', 'name' => 'Product 1'],
            ['id' => 'p2', 'name' => 'Product 2'],
        ];

        $client = $this->mock(CjApiClient::class);
        $client->shouldReceive('getProducts')
            ->once()
            ->andReturn($apiResponse);

        $mapper = $this->mock(CjProductMapper::class);
        $mapper->shouldReceive('mapFromList')
            ->twice()
            ->withAnyArgs()
            ->andReturnValues([
                $mappedProducts[0],
                $mappedProducts[1],
            ]);

        $this->app->instance(CjApiClient::class, $client);
        $this->app->instance(CjProductMapper::class, $mapper);

        $service = $this->app->make(CjProductService::class);

        $result = $service->get('123', 1, 10);

        $this->assertEquals([
            'products' => $mappedProducts,
            'pagination' => [
                'page' => 1,
                'page_size' => 10,
                'total_pages' => 5,
                'total_records' => 50,
            ],
        ], $result);
    }
    
    public function test_returns_product_details()
    {
        $apiResponse = [
            'id' => 'p1',
            'name' => 'Test Product',
        ];

        $client = $this->mock(CjApiClient::class);
        $client->shouldReceive('getProductDetails')
            ->once()
            ->with('p1')
            ->andReturn($apiResponse);

        $mapper = $this->mock(CjProductMapper::class);
        $mapper->shouldNotReceive('mapFromList');

        $this->app->instance(CjApiClient::class, $client);
        $this->app->instance(CjProductMapper::class, $mapper);

        $service = $this->app->make(CjProductService::class);

        $result = $service->getProductDetails('p1');

        $this->assertEquals($apiResponse, $result);
    }
}
