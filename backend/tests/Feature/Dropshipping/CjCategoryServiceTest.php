<?php

namespace Tests\Feature\Dropshipping;

use App\Dropshipping\API\CjApiClient;
use App\Dropshipping\Mappers\CjCategoryMapper;
use App\Dropshipping\Services\CjCategoryService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class CjCategoryServiceTest extends TestCase
{
    public function test_returns_mapped_categories()
    {
        $rawApiData = [
            ['id' => '1', 'name' => 'Electronics'],
            ['id' => '2', 'name' => 'Fashion'],
        ];

        $mappedData = [
            ['value' => '1', 'label' => 'Electronics'],
            ['value' => '2', 'label' => 'Fashion'],
        ];

        // Mock dependencies
        $client = $this->mock(CjApiClient::class);
        $client->shouldReceive('getCategories')
            ->once()
            ->andReturn($rawApiData);

        $mapper = $this->mock(CjCategoryMapper::class);
        $mapper->shouldReceive('map')
            ->once()
            ->with($rawApiData)
            ->andReturn($mappedData);

        $this->app->instance(CjApiClient::class, $client);
        $this->app->instance(CjCategoryMapper::class, $mapper);

        $service = $this->app->make(CjCategoryService::class);

        $result = $service->all();

        $this->assertEquals($mappedData, $result);
    }
}
