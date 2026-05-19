<?php

namespace Tests\Feature\Dropshipping;

use App\Dropshipping\DTO\CategoryDTO;
use App\Dropshipping\Mappers\CjCategoryMapper;
use Tests\TestCase;

class CjCategoryMapperTest extends TestCase
{
    public function test_maps_flat_categories()
    {
        $mapper = new CjCategoryMapper();

        $result = $mapper->map([
            [
                'categoryId' => '1',
                'categoryName' => 'Electronics',
            ],
        ]);

        $this->assertCount(1, $result);

        $this->assertInstanceOf(CategoryDTO::class, $result[0]);

        $this->assertEquals('1', $result[0]->externalId);
        $this->assertEquals('Electronics', $result[0]->name);
        $this->assertNull($result[0]->parentId);
    }

    public function test_maps_nested_categories()
    {
        $mapper = new CjCategoryMapper();

        $result = $mapper->map([
            [
                'categoryFirstId' => '10',
                'categoryFirstName' => 'Phones',
                'categoryFirstList' => [
                    [
                        'categorySecondId' => '20',
                        'categorySecondName' => 'Smartphones',
                        'categorySecondList' => [
                            [
                                'categoryId' => '30',
                                'categoryName' => 'Android',
                            ],
                        ],
                    ],
                ],
            ],
        ]);

        $this->assertCount(3, $result);

        $this->assertEquals('10', $result[0]->externalId);
        $this->assertEquals('Phones', $result[0]->name);
        $this->assertNull($result[0]->parentId);

        $this->assertEquals('20', $result[1]->externalId);
        $this->assertEquals('Smartphones', $result[1]->name);
        $this->assertEquals('10', $result[1]->parentId);

        $this->assertEquals('30', $result[2]->externalId);
        $this->assertEquals('Android', $result[2]->name);
        $this->assertEquals('20', $result[2]->parentId);
    }

    public function test_returns_empty_array_when_no_data()
    {
        $mapper = new CjCategoryMapper();

        $result = $mapper->map([]);

        $this->assertEquals([], $result);
    }
}
