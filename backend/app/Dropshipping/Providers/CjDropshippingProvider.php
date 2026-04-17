<?php
namespace App\Dropshipping\Providers;

use App\Dropshipping\Contracts\DropshippingProviderInterface;
use App\Dropshipping\Services\CjCategoryService;
use App\Dropshipping\Services\CjProductService;

class CjDropshippingProvider implements DropshippingProviderInterface
{
    public function __construct(
        private CjCategoryService $categories,
        private CjProductService $products
    ) {}

    public function getName(): string
    {
        return 'cj';
    }

    public function getCategories(): array
    {
        return $this->categories->all();
    }

    public function getProducts(array $filters = []): array
    {
        // map CJ response → ProductData
    }

    public function activateProduct(string $externalId): bool
    {
        // CJ-specific logic
    }
    
    public function deactivateProduct(string $externalId): bool
    {
        // CJ-specific logic
    }
}
