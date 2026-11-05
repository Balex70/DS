<?php

namespace App\SearchEngine\Providers\OpenSearch;

use App\SearchEngine\Contracts\SearchEngineInterface;
use OpenSearch\Client;
use OpenSearch\GuzzleClientFactory;
use LogicException;

class OpenSearchProvider implements SearchEngineInterface
{
    protected Client $client;

    public function __construct(GuzzleClientFactory $clientFactory)
    {
        $this->client = $clientFactory->create([
            'base_uri' => config('services.opensearch.host'),
        ]);
    }

    public function getName(): string
    {
        return 'opensearch';
    }
    
    public function info(): array
    {
        return $this->client->info();
    }

    public function searchProducts(
        string $search,
        ?string $locale = null,
        array $filters = [],
        int $page = 1,
        int $perPage = 20
    ): array {
        throw new LogicException('OpenSearch product search is not implemented yet.');
    }
}
