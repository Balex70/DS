<?php
namespace App\Dropshipping\DTO;
readonly class ProductDTO
{
    public function __construct(
        public string $externalId,

        public string $name,
        public ?string $description,

        public float $price,
        public ?float $nowPrice,
        public ?float $suggestedPrice,

        public ?string $bigImage,

        public bool $isCollect,
        public bool $addMarkStatus,
        public ?int $warehouseInventoryNum,

        /** @var ProductVariantDTO[] */
        public array $variants = [],

        /** @var string[] */
        public array $images = [],

        public array $raw = [],
    ) {}
}
