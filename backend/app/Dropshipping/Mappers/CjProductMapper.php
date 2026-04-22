<?php

namespace App\Dropshipping\Mappers;

use App\Dropshipping\DTO\ProductVariantDTO;

class CjProductMapper
{
    public function mapFromList(array $data): array
    {
        return [
            'external_id' => $data['id'],

            'name_raw' => $data['nameEn'] ?? '',
            'description_raw' => null, // comes from detail API later

            'price' => $this->parsePrice($data['sellPrice'] ?? null),
            'now_price' => $this->parsePrice($data['nowPrice'] ?? null),
            'suggested_price' => $this->parsePrice($data['suggestedPrice'] ?? null),

            'big_image' => $data['bigImage'] ?? null,

            'is_collect' => (bool) ($data['isCollect'] ?? false),
            'add_mark_status' => (bool) ($data['addMarkStatus'] ?? false),
            'warehouse_inventory_num' => $data['warehouseInventoryNum'] ?? null,

            'raw_data' => json_encode($data),
        ];
    }

    public function mapDetail(array $data, array $base): array
    {
        $images = $this->extractImages($data);

        $variants = $this->mapVariants($data['variants'] ?? []);

        return [
            'external_id' => $base['external_id'],

            'name_raw' => $data['productNameEn'] ?? $base['name_raw'],
            
            'description_raw' => $this->cleanHtml($data['description_raw']) ?? null,

            'price' => $this->parsePrice($data['sellPrice'] ?? $base['price'] ?? null),
            'now_price' => $this->parsePrice($data['nowPrice'] ?? $base['now_price'] ?? null),
            'suggested_price' => $this->parsePrice($data['suggestedSellPrice'] ?? $base['suggested_price'] ?? null),

            'big_image' => $data['bigImage'] ?? $base['big_image'] ?? null,

            'is_collect' => (bool) $data['isCollect'] ?? $base['is_collect'] ?? null,
            'add_mark_status' => (bool) $data['addMarkStatus'] ?? $base['add_mark_status'] ?? null,
            'warehouse_inventory_num' => $data['warehouseInventoryNum'] ?? $base['warehouse_inventory_num'] ?? null,

            'variants' => $variants,

            'images' => $images,

            'raw_data' => array_merge($base['raw_data'], $data)
        ];
    }
    
    private function extractImages(array $cjImages): array
    {
        $images = [];

        if (!empty($cjImages['productImageSet'])) {
            $images = array_merge($images, $cjImages['productImageSet']);
        }

        return array_values(array_unique($images));
    }
    
    private function mapVariants(array $variants): array
    {
        return array_map(function ($v) {
            return new ProductVariantDTO(
                externalId: $v['vid'],
                sku: $v['variantSku'] ?? null,
                name: $v['variantNameEn'] ?? null,
                price: (float) $v['variantSellPrice'],
                stock: $v['inventoryNum'] ?? null,
                weight: isset($v['variantWeight'])
                    ? (float) $v['variantWeight']
                    : null,
                volume: isset($v['variantVolume'])
                    ? (float) $v['variantVolume']
                    : null,
                image: $v['variantImage'] ?? null,
            );
        }, $variants);
    }
    
    private function cleanHtml(?string $html): ?string
    {
        if (!$html) {
            return null;
        }

        return trim(strip_tags($html, '<p><b><br><img><ul><li><strong><em>'));
    }
    private function parsePrice(?string $price): ?float
    {
        if (!$price) return null;

        if (str_contains($price, '--')) {
            return (float) explode('--', $price)[0]; // take min price TODO: change this
        }

        return (float) $price;
    }
}
