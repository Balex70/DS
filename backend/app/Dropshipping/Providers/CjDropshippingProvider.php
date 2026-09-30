<?php
namespace App\Dropshipping\Providers;

use App\Dropshipping\Contracts\DropshippingProviderInterface;
use App\Dropshipping\Services\CjCategoryService;
use App\Dropshipping\Services\CjOrderService;
use App\Dropshipping\Services\CjProductService;

class CjDropshippingProvider implements DropshippingProviderInterface
{
    public function __construct(
        private CjCategoryService $categories,
        private CjProductService $products,
        private CjOrderService $order
    ) {}

    public function getName(): string
    {
        return 'cj';
    }

    public function getCategories(): array
    {
        return $this->categories->all();
    }

    public function getProducts(string $categoryId, int $page, int $size = 10): array
    {
        // Get products with pagination data
        return $this->products->get($categoryId, $page, $size);
    }

    public function getProductDetails(string $externalProductId): array
    {
        // Get product details
        return $this->products->getProductDetails($externalProductId);
    }

    public function calculateShipping(array $payload): array
    {
        return $this->products->calculateShipping($payload);
    }

    public function createOrder(array $payload): array
    {
        return $this->order->create($payload);
    }

    public function checkOrderStatus(array $payload): array
    {
        return $this->order->checkStatus($payload['orderId']);
    }

    public function trackInfo(array $payload): array
    {
        return $this->order->trackInfo($payload['trackNumber']);
    }

    public function simulatePayOrder(array $payload): array
    {
        return $this->order->simulatePayOrder($payload['orderId']);
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
