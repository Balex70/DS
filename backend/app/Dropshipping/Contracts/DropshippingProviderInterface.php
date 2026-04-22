<?php
namespace App\Dropshipping\Contracts;

interface DropshippingProviderInterface
{
    public function getName(): string;

    public function getCategories(): array;

    public function getProducts(string $categoryId, int $page, int $size): array;

    public function activateProduct(string $externalId): bool;

    public function deactivateProduct(string $externalId): bool;
}
