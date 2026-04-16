<?php
namespace App\Dropshipping\DTO;
readonly class CategoryDTO
{
    public function __construct(
        public string $externalId,
        public string $name,
        public ?string $parentId,
    ) {}
}
