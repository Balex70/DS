<?php

namespace Tests\Feature\Dropshipping;

use App\Dropshipping\Providers\CjDropshippingProvider;
use App\Dropshipping\Services\CjCategoryService;
use App\Dropshipping\Services\CjProductService;
use Tests\TestCase;

class CjDropshippingProviderTest extends TestCase
{
    public function test_get_name_returns_cj()
    {
        $provider = app(CjDropshippingProvider::class);

        $this->assertEquals('cj', $provider->getName());
    }

    public function test_get_categories_delegates_to_service()
    {
        $this->mock(CjCategoryService::class, function ($mock) {
            $mock->shouldReceive('all')
                ->once()
                ->andReturn([['id' => 1, 'name' => 'Electronics']]);
        });

        $provider = app(CjDropshippingProvider::class);

        $result = $provider->getCategories();

        $this->assertEquals([['id' => 1, 'name' => 'Electronics']], $result);
    }

    public function test_get_products_delegates_to_product_service()
    {
        $this->mock(CjProductService::class, function ($mock) {
            $mock->shouldReceive('get')
                ->once()
                ->with('123', 1, 10)
                ->andReturn([
                    'products' => [],
                    'pagination' => [
                        'page' => 1,
                        'page_size' => 10,
                        'total_pages' => 0,
                        'total_records' => 0,
                    ],
                ]);
        });

        $provider = app(CjDropshippingProvider::class);

        $result = $provider->getProducts('123', 1, 10);

        $this->assertIsArray($result);
        $this->assertArrayHasKey('products', $result);
        $this->assertArrayHasKey('pagination', $result);
    }

    public function test_get_product_details_delegates_to_service()
    {
        $this->mock(CjProductService::class, function ($mock) {
            $mock->shouldReceive('getProductDetails')
                ->once()
                ->with('ext-1')
                ->andReturn(['id' => 'ext-1']);
        });

        $provider = app(CjDropshippingProvider::class);

        $result = $provider->getProductDetails('ext-1');

        $this->assertEquals(['id' => 'ext-1'], $result);
    }
}
