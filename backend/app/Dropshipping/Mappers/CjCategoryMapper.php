<?php

namespace App\Dropshipping\Mappers;

use App\Dropshipping\DTO\CategoryDTO;

class CjCategoryMapper
{
    public function map(array $data): array
    {
        $result = [];

        foreach ($data as $item) {
            $this->mapRecursive($item, null, $result);
        }

        return $result;
    }

    private function mapRecursive(array $item, ?string $parentId, array &$result): void
    {
        $id = $item['categoryFirstId'] 
            ?? $item['categorySecondId'] 
            ?? $item['categoryId'];

        $name = $item['categoryFirstName'] 
            ?? $item['categorySecondName'] 
            ?? $item['categoryName'];

        $result[] = new CategoryDTO(
            externalId: $id,
            name: $name,
            parentId: $parentId
        );

        $children = $item['categoryFirstList'] 
            ?? $item['categorySecondList'] 
            ?? [];

        foreach ($children as $child) {
            $this->mapRecursive($child, $id, $result);
        }
    }
}
