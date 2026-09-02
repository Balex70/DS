<?php

namespace Tests\Feature\Dropshipping;

use App\Dropshipping\API\CjApiClient;
use App\Dropshipping\Services\CjAuthService;
use Illuminate\Support\Facades\Http;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class CjApiClientTest extends TestCase
{
    protected function makeClient($token = 'test-token'): CjApiClient
    {
        $auth = $this->instance(
            CjAuthService::class,
            \Mockery::mock(CjAuthService::class, function ($mock) use ($token) {
                $mock->shouldReceive('getValidAccessToken')
                    ->andReturn($token);
            })
        );

        return new CjApiClient($auth);
    }
    
    public function test_get_categories_throws_when_no_token()
    {
        $client = $this->makeClient(null);

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('CJ authentication failed');

        $client->getCategories();
    }
    
    public function test_get_products_throws_when_no_token()
    {
        $client = $this->makeClient(null);

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('CJ authentication failed');

        $client->getProducts('123', 2, 20);
    }
    
    public function test_get_product_details_throws_when_no_token()
    {
        $client = $this->makeClient(null);

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('CJ authentication failed');

        $client->getProductDetails('123gh56');
    }
    
    #[DataProvider('get_categories_throws_on_api_error_provider')]
    public function test_get_categories_throws_on_api_error(?string $message, string $errorMessage)
    {
        $responseReturn = [
            'code' => 500,
        ];
        
        if($message !== null) {
            $responseReturn['message'] = $message;
        }
        Http::fake([
            '*' => Http::response($responseReturn, 200)
        ]);

        $client = $this->makeClient();

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage("CJ API error: {$errorMessage}");

        $client->getCategories();
    }
    
    public static function get_categories_throws_on_api_error_provider(): array
    {
        return [
            'Bad request return Bad request' => ['Bad request', 'Bad request'],
            'No message return Unknown error' => [null, 'Unknown error'],
        ];
    }
    
    public function test_get_categories_returns_data()
    {
        Http::fake([
            '*' => Http::response([
                'code' => 200,
                'data' => ['cat1', 'cat2']
            ], 200)
        ]);

        $client = $this->makeClient();

        $result = $client->getCategories();

        $this->assertEquals(['cat1', 'cat2'], $result);
    }
    
    public function test_get_products_sends_correct_params()
    {
        // Http::fake();
        Http::fake([
            'developers.cjdropshipping.com/api2.0/v1/product/listV2*' => Http::response([
                'code' => 200,
                'data' => []
            ], 200),
        ]);
        

        $client = $this->makeClient();

        $client->getProducts('123', 2, 20);
        
        Http::assertSent(function ($request) {
            return str_contains($request->url(), 'developers.cjdropshipping.com/api2.0/v1/product/listV2')
                && $request['categoryId'] === '123'
                && $request['page'] === 2
                && $request['size'] === 20;
        });
    }
    
    public function test_get_products_returns_data()
    {
        $products = [
            [
                'id' => 'p1',
                'name' => 'Product 1',
            ],
            [
                'id' => 'p2',
                'name' => 'Product 2',
            ],
        ];

        Http::fake([
            '*' => Http::response([
                'code' => 200,
                'data' => $products,
            ], 200),
        ]);

        $client = $this->makeClient();

        $result = $client->getProducts('123', 1, 10);

        $this->assertEquals($products, $result);
    }
    
    public function test_get_product_details_returns_data()
    {
        Http::fake([
            '*' => Http::response([
                'code' => 200,
                'data' => ['id' => 'abc']
            ], 200)
        ]);

        $client = $this->makeClient();

        $result = $client->getProductDetails('abc');

        $this->assertEquals(['id' => 'abc'], $result);
    }
}
