<?php
namespace App\Dropshipping\Providers;

use App\Dropshipping\Contracts\DropshippingProviderInterface;
use App\Dropshipping\DTO\CategoryDTO;
use Illuminate\Support\Facades\Http;

class CjDropshippingProvider implements DropshippingProviderInterface
{
    public function getName(): string
    {
        return 'cj';
    }

    public function getCategories(): array
    {
        $response = Http::get('cj-api/categories');

        $data = $response->json();

        return array_map(
            fn ($item) => CategoryDTO::fromArray($item),
            $data
        );
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
