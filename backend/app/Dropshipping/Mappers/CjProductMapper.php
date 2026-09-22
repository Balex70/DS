<?php

namespace App\Dropshipping\Mappers;

class CjProductMapper
{
    public function mapFromList(array $data): array
    {
        return [
            'external_id' => $data['id'],

            'name_raw' => $data['nameEn'] ?? '',
            'description_raw' => null, // comes from detail API later

            'cost_price' => $this->parsePrice($data['sellPrice'] ?? null),
            'price' => null,
            'now_price' => $this->parsePrice($data['nowPrice'] ?? null),
            'suggested_price' => $this->parsePrice($data['suggestedPrice'] ?? null),

            'sku' => $data['sku'] ?? null,

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
        $name = $data['productNameEn'] ?? $base['name_raw'];

        $variants = $this->mapVariants($data['variants'] ?? [], $name);

        return [
            'external_id' => $base['external_id'],

            'name_raw' => $name,
            
            'description_raw' => $this->cleanHtml($data['description']) ?? null,

            'price' => $this->parsePrice($data['sellPrice'] ?? $base['price'] ?? null),
            'now_price' => $this->parsePrice($data['nowPrice'] ?? $base['now_price'] ?? null),
            'suggested_price' => $this->parsePrice($data['suggestedSellPrice'] ?? $base['suggested_price'] ?? null),

            'sku' => $data['productSku'] ?? $base['sku'] ?? null,
            'product_weight' => $data['productWeight'] ?? null,
            'packing_weight' => $data['packingWeight'] ?? null,

            'material' => $this->parseMaterial($data['materialNameEnSet'] ?? null),

            'big_image' => $data['bigImage'] ?? $base['big_image'] ?? null,

            'add_mark_status' => (bool) ($data['addMarkStatus'] ?? $base['add_mark_status'] ?? null),

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
    
    private function mapVariants(array $variants, ?string $productName): array
    {
        return array_map(function ($v) use ($productName) {
            $sku = $v['variantSku'] ?? null;
            $key = $v['variantKey'] ?? null;

            if ($key === 'defaulttitle' || $key === 'Defaulttitle') {
                $key = $sku;
            }

            $variantName = $v['variantNameEn'] ?? null;

            return [
                'external_id' => $v['vid'] ?? null,
                'sku' => $sku,
                'name' => $variantName ?: $productName,
                'key' => $key,
                'price' => $this->parsePrice($v['variantSellPrice'] ?? null),
                'stock' => isset($v['inventoryNum']) ? (int) $v['inventoryNum'] : null,
                'weight' => $v['variantWeight'] ?? null,
                'volume' => $v['variantVolume'] ?? null,
                'image' => $v['variantImage'] ?? null,
            ];
        }, $variants);
    }
    
    private function cleanHtml(?string $html): ?string
    {
        if (!$html) {
            return null;
        }

        return trim(strip_tags($html, '<p><b><br><img><ul><li><strong><em>'));
    }
    public function parsePrice(?string $price): ?int
    {
        if ($price === null || $price === '') {
            return null;
        }

        if (str_contains($price, '-')) {
            $price = explode('-', $price)[0]; // take min price by cheapest variant
        }

        return $this->priceToCents($price);
    }

    public function priceToCents(string|int|float $value): int
    {
        return (int) round(((float) $value) * 100);
    }

    public static function parseMaterial(string|array|null $raw): ?array
    {
        if (!$raw) {
            return null;
        }

        // already correct format
        if (is_array($raw)) {
            return array_values(array_filter($raw));
        }

        $decoded = json_decode($raw, true);

        // handle double-encoded JSON
        if (is_string($decoded)) {
            $decoded = json_decode($decoded, true);
        }

        if (is_array($decoded)) {
            return array_values(array_filter($decoded));
        }

        if (is_string($decoded)) {
            return [$decoded];
        }

        return null;
    }
}
