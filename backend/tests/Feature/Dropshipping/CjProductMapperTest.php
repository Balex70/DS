<?php

namespace Tests\Feature\Dropshipping;

use App\Dropshipping\Mappers\CjProductMapper;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class CjProductMapperTest extends TestCase
{
    public function test_maps_product_from_list()
    {
        $mapper = new CjProductMapper();

        $result = $mapper->mapFromList([
            'id' => 'p1',
            'nameEn' => 'iPhone',
            'sellPrice' => '10.5',
            'nowPrice' => '8.5',
            'suggestedPrice' => '12.5',
            'bigImage' => 'image.jpg',
            'isCollect' => true,
            'addMarkStatus' => false,
            'warehouseInventoryNum' => 50,
        ]);

        $this->assertEquals('p1', $result['external_id']);
        $this->assertEquals('iPhone', $result['name_raw']);
        $this->assertEquals(10.5, $result['price']);
        $this->assertEquals(8.5, $result['now_price']);
        $this->assertEquals(12.5, $result['suggested_price']);
        $this->assertEquals('image.jpg', $result['big_image']);
        $this->assertTrue($result['is_collect']);
        $this->assertFalse($result['add_mark_status']);
        $this->assertEquals(50, $result['warehouse_inventory_num']);
    }

    public function test_maps_product_detail()
    {
        $mapper = new CjProductMapper();

        $base = [
            'external_id' => 'p1',
            'name_raw' => 'Old Name',
            'price' => 10,
            'now_price' => 9,
            'suggested_price' => 12,
            'big_image' => 'old.jpg',
            'add_mark_status' => false,
            'raw_data' => [],
        ];

        $result = $mapper->mapDetail([
            'productNameEn' => 'New Name',
            'description' => '<p>Hello <strong>World</strong></p>',
            'sellPrice' => '20',
            'nowPrice' => '18',
            'suggestedSellPrice' => '25',
            'bigImage' => 'new.jpg',
            'addMarkStatus' => true,

            'productImageSet' => [
                '1.jpg',
                '2.jpg',
                '1.jpg',
            ],

            'variants' => [
                [
                    'vid' => 'v1',
                    'variantSku' => 'sku-1',
                    'variantNameEn' => 'Red',
                    'variantSellPrice' => '15',
                    'variantWeight' => '0.5',
                    'variantVolume' => '1.2',
                    'variantImage' => 'variant.jpg',
                ]
            ]
        ], $base);

        $this->assertEquals('p1', $result['external_id']);
        $this->assertEquals('New Name', $result['name_raw']);
        $this->assertEquals('<p>Hello <strong>World</strong></p>', $result['description_raw']);

        $this->assertEquals(20.0, $result['price']);
        $this->assertEquals(18.0, $result['now_price']);
        $this->assertEquals(25.0, $result['suggested_price']);

        $this->assertEquals('new.jpg', $result['big_image']);

        $this->assertTrue($result['add_mark_status']);

        $this->assertCount(2, $result['images']);

        $this->assertCount(1, $result['variants']);

        $this->assertEquals('v1', $result['variants'][0]['external_id']);
        $this->assertEquals('sku-1', $result['variants'][0]['sku']);
        $this->assertEquals('Red', $result['variants'][0]['name']);
        $this->assertEquals(15.0, $result['variants'][0]['price']);
        $this->assertEquals(0.5, $result['variants'][0]['weight']);
        $this->assertEquals(1.2, $result['variants'][0]['volume']);
        $this->assertEquals('variant.jpg', $result['variants'][0]['image']);
    }

    public function test_parse_price_range_uses_minimum_price()
    {
        $mapper = new CjProductMapper();

        $result = $mapper->mapFromList([
            'id' => 'p1',
            'sellPrice' => '10--20',
        ]);

        $this->assertEquals(10.0, $result['price']);
    }

    public function test_returns_null_price_when_price_missing()
    {
        $mapper = new CjProductMapper();

        $result = $mapper->mapFromList([
            'id' => 'p1',
        ]);

        $this->assertNull($result['price']);
        $this->assertNull($result['now_price']);
        $this->assertNull($result['suggested_price']);
    }

    public function test_clean_html_returns_null_when_empty()
    {
        $mapper = new CjProductMapper();

        $base = [
            'external_id' => 'p1',
            'name_raw' => 'Test',
            'price' => null,
            'now_price' => null,
            'suggested_price' => null,
            'big_image' => null,
            'add_mark_status' => false,
            'raw_data' => [],
        ];

        $result = $mapper->mapDetail([
            'description' => null,
        ], $base);

        $this->assertNull($result['description_raw']);
    }
}
