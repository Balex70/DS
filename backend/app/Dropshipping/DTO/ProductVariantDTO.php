<?php
namespace App\Dropshipping\DTO;

class ProductVariantDTO
{
    public function __construct(
        public string $externalId,

        public ?string $sku,
        public ?string $name,

        public float $price,

        public ?int $stock,
        public ?float $weight = null,
        public ?float $volume = null,

        public ?string $image = null,
    ) {}
}
