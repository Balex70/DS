<?php

namespace App\SearchEngine\Providers\OpenSearch;

use App\SearchEngine\Contracts\SearchEngineInterface;
use OpenSearch\Client;
use OpenSearch\GuzzleClientFactory;

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

    public function indexProduct(array $product): void
    {
        $this->client->index([
            'index' => 'products',
            'id' => $product['id'],
            'body' => $product,
        ]);
    }

    public function fullSearchProducts(
        string $search,
        ?string $locale = null,
        array $filters = [],
        int $page = 1,
        int $perPage = 10
    ): array {
        // Default filters
        $defaultFilters = [
            ['exists' => ['field' => 'last_enrichment_at']],
            ['exists' => ['field' => 'ai_texts_at']],
        ];

        // Dynamic filters
        $searchFilters = [];
        if (!empty($filters['category_ids'])) {
            $searchFilters[] = [
                'terms' => [
                    'visible_category_ids' => $filters['category_ids'],
                ],
            ];
        }
        if (isset($filters['min_price']) || isset($filters['max_price'])) {
            $priceRange = [];
            if (isset($filters['min_price'])) {
                $priceRange['gte'] = $filters['min_price'];
            }
            if (isset($filters['max_price'])) {
                $priceRange['lte'] = $filters['max_price'];
            }
            $searchFilters[] = [
                'range' => [
                    'price' => $priceRange,
                ],
            ];
        }

        $response = $this->client->search([
            'index' => 'products',
            'body' => [
                'from' => ($page - 1) * $perPage,
                'size' => $perPage,
                'track_total_hits' => true,
                'query' => [
                    'bool' => [
                        'must' => $search !== null && $search !== ''
                            ? [[
                                'multi_match' => [
                                    'query' => $search,
                                    'fields' => ['name_raw', 'name_processed'],
                                ],
                            ]]
                            : [],
                        'must_not' => [
                            ['exists' => ['field' => 'enrichment_failed_at']],
                        ],
                        'filter' => [
                            ...$defaultFilters,
                            ...$searchFilters,
                        ],
                    ],
                ],
                'aggs' => [
                    'price_stats' => [
                        'stats' => [
                            'field' => 'price',
                        ],
                    ],
                    'materials' => [
                        'nested' => [
                            'path' => 'materials',
                        ],
                        'aggs' => [
                            'material_ids' => [
                                'terms' => [
                                    'field' => 'materials.id',
                                    'size' => 100,
                                ],
                                'aggs' => [
                                    'material_details' => [
                                        'top_hits' => [
                                            'size' => 1,
                                            '_source' => [
                                                'includes' => [
                                                    'materials.id',
                                                    'materials.name',
                                                    'materials.translations',
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ]);

        $total = $response['hits']['total']['value'];
        $aggregations = $response['aggregations'];
        return [
            'products' => [
                'data' => array_map(
                    fn (array $hit) => $hit['_source'],
                    $response['hits']['hits']
                ),
                'meta' => [
                    'current_page' => $page,
                    'last_page' => (int) ceil($total / $perPage),
                    'per_page' => $perPage,
                    'total' => $total,
                ],
            ],
            'filters' => [
                'price' => [
                    'min' => $aggregations['price_stats']['min'] ?? 0,
                    'max' => $aggregations['price_stats']['max'] ?? 0,
                ],
                'materials' => array_map(
                    fn (array $bucket) => [
                        'id' => $bucket['key'],
                        'count' => $bucket['doc_count'],
                        'name' => $bucket['material_details']['hits']['hits'][0]['_source']['name'] ?? null,
                        'translations' => $bucket['material_details']['hits']['hits'][0]['_source']['translations'] ?? [],
                    ],
                    $aggregations['materials']['material_ids']['buckets']
                ),
            ],
        ];
    }
}
