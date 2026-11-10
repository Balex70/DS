<?php

namespace App\SearchEngine\Providers\OpenSearch;

use App\Actions\CreateAppLogAction;
use App\Enums\AppLogLevelEnum;
use App\Enums\AppLogRealmEnum;
use App\SearchEngine\Contracts\SearchEngineInterface;
use OpenSearch\Client;
use OpenSearch\GuzzleClientFactory;
use RuntimeException;

class OpenSearchProvider implements SearchEngineInterface
{
    protected Client $client;

    public function __construct(
        private GuzzleClientFactory $clientFactory,
        private CreateAppLogAction $createAppLogAction,
    ) {
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

    public function deleteProduct(int $productId): void
    {
        $this->client->delete([
            'index' => 'products',
            'id' => (string) $productId,
        ]);
    }

    public function clearProductsIndex(): void
    {
        $this->client->deleteByQuery([
            'index' => 'products',
            'body' => [
                'query' => [
                    'match_all' => new \stdClass(),
                ],
            ],
        ]);
    }

    public function bulkIndexProducts(array $documents): void
    {
        if (empty($documents)) {
            return;
        }

        $body = [];

        foreach ($documents as $document) {
            $body[] = [
                'index' => [
                    '_index' => 'products',
                    '_id' => (string) $document['id'],
                ],
            ];

            $body[] = $document;
        }

        $response = $this->client->bulk([
            'body' => $body,
        ]);

        if ($response['errors'] ?? false) {
            $errors = [];

            foreach ($response['items'] as $item) {
                $result = $item['index'];

                if (isset($result['error'])) {
                    $this->createAppLogAction->execute(
                        level: AppLogLevelEnum::ERROR,
                        realm: AppLogRealmEnum::PRODUCT,
                        message: 'OpenSearch bulk indexing failed: ' . $result['_id'] ?? null . ' Error: ' . $result['error'],
                    );

                    $errors[] = $result['_id'] ?? 'unknown';
                }
            }

            throw new RuntimeException(
                'OpenSearch bulk indexing failed for products: ' . implode(', ', $errors)
            );
        }
    }

    public function searchProducts(
        string $search,
        ?string $locale = null,
        array $filters = [],
        ?int $limit = 10
    ): array {
        $sortOptions = [
            'created_at' => [
                'order' => 'desc'
            ]
        ];

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

        $response = $this->client->search([
            'index' => 'products',
            'body' => [
                'size' => $limit,
                'track_total_hits' => true,
                'sort' => $sortOptions,
                'query' => [
                    'bool' => [
                        'must' => $search !== null && $search !== ''
                        ? [
                            [
                                'bool' => [
                                    'should' => [
                                        [
                                            'multi_match' => [
                                                'query' => $search,
                                                'fields' => [
                                                    'name_raw',
                                                    'name_processed',
                                                    'translations.name',
                                                ],
                                            ],
                                        ],
                                        // Variant names
                                        [
                                            'nested' => [
                                                'path' => 'variants',
                                                'query' => [
                                                    'multi_match' => [
                                                        'query' => $search,
                                                        'fields' => [
                                                            'variants.name',
                                                            'variants.name_processed',
                                                        ],
                                                    ],
                                                ],
                                            ],
                                        ],

                                        // Variant translations (nested inside variants)
                                        [
                                            'nested' => [
                                                'path' => 'variants',
                                                'query' => [
                                                    'nested' => [
                                                        'path' => 'variants.translations',
                                                        'query' => [
                                                            'match' => [
                                                                'variants.translations.name' => $search,
                                                            ],
                                                        ],
                                                    ],
                                                ],
                                            ],
                                        ],
                                    ],
                                    'minimum_should_match' => 1,
                                ],
                            ],
                        ]
                        : [],
                        'must_not' => [
                            ['exists' => ['field' => 'enrichment_failed_at']],
                        ],
                        'filter' => $defaultFilters,
                    ],
                ],

                'post_filter' => [
                    'bool' => [
                        'filter' => $searchFilters,
                    ],
                ],
            ],
        ]);

        return array_map(
            fn (array $hit) => $hit['_source'],
            $response['hits']['hits']
        );
    }

    public function fullSearchProducts(
        string $search,
        ?string $locale = null,
        string $sort = 'latest',
        array $filters = [],
        int $page = 1,
        int $perPage = 10
    ): array {
        $sortOptions = match ($sort) {
            'latest' => [
                ['created_at' => ['order' => 'desc']],
            ],
            'price_asc' => [
                ['price' => ['order' => 'asc']],
            ],
            'price_desc' => [
                ['price' => ['order' => 'desc']],
            ],
            default => [
                ['created_at' => ['order' => 'desc']],
            ],
        };

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

        if (!empty($filters['materials'])) {
            $searchFilters[] = [
                'nested' => [
                    'path' => 'materials',
                    'query' => [
                        'terms' => [
                            'materials.id' => $filters['materials'],
                        ],
                    ],
                ],
            ];
        }

        $response = $this->client->search([
            'index' => 'products',
            'body' => [
                'from' => ($page - 1) * $perPage,
                'size' => $perPage,
                'track_total_hits' => true,
                'sort' => $sortOptions,
                'query' => [
                    'bool' => [
                        'must' => $search !== null && $search !== ''
                        ? [
                            [
                                'bool' => [
                                    'should' => [
                                        [
                                            'multi_match' => [
                                                'query' => $search,
                                                'fields' => [
                                                    'name_raw',
                                                    'name_processed',
                                                    'translations.name',
                                                ],
                                            ],
                                        ],
                                        // Variant names
                                        [
                                            'nested' => [
                                                'path' => 'variants',
                                                'query' => [
                                                    'multi_match' => [
                                                        'query' => $search,
                                                        'fields' => [
                                                            'variants.name',
                                                            'variants.name_processed',
                                                        ],
                                                    ],
                                                ],
                                            ],
                                        ],

                                        // Variant translations (nested inside variants)
                                        [
                                            'nested' => [
                                                'path' => 'variants',
                                                'query' => [
                                                    'nested' => [
                                                        'path' => 'variants.translations',
                                                        'query' => [
                                                            'match' => [
                                                                'variants.translations.name' => $search,
                                                            ],
                                                        ],
                                                    ],
                                                ],
                                            ],
                                        ],
                                    ],
                                    'minimum_should_match' => 1,
                                ],
                            ],
                        ]
                        : [],
                        'must_not' => [
                            ['exists' => ['field' => 'enrichment_failed_at']],
                        ],
                        'filter' => $defaultFilters,
                    ],
                ],

                'post_filter' => [
                    'bool' => [
                        'filter' => $searchFilters,
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

    public function applyProductsIndexConfiguration(): void
    {
        $indexExists = $this->client->indices()->exists([
            'index' => 'products',
        ]);

        if ($indexExists) {
            $this->client->indices()->delete([
                'index' => 'products',
            ]);
        }

        $this->client->indices()->create([
            'index' => 'products',
            'body' => $this->productsIndexConfiguration(),
        ]);
    }

    private function productsIndexConfiguration(): array
    {
        return [
            'settings' => [
                'index' => [
                    'max_ngram_diff' => 23,
                    'number_of_shards' => 1,
                    'number_of_replicas' => 1,
                ],
                'analysis' => [
                    'tokenizer' => [
                        'product_ngram_tokenizer' => [
                            'type' => 'ngram',
                            'min_gram' => 2,
                            'max_gram' => 25,
                            'token_chars' => ['letter', 'digit'],
                        ],
                    ],
                    'analyzer' => [
                        'product_ngram_analyzer' => [
                            'type' => 'custom',
                            'tokenizer' => 'product_ngram_tokenizer',
                            'filter' => ['lowercase'],
                        ],
                        'product_search_analyzer' => [
                            'type' => 'custom',
                            'tokenizer' => 'standard',
                            'filter' => ['lowercase'],
                        ],
                    ],
                ],
            ],
            'mappings' => [
                'properties' => [
                    'ai_texts_at' => [
                        'type' => 'date',
                    ],
                    'big_image' => [
                        'properties' => [
                            'created_at' => ['type' => 'date'],
                            'id' => ['type' => 'long'],
                            'original_url' => [
                                'type' => 'text',
                                'fields' => [
                                    'keyword' => [
                                        'type' => 'keyword',
                                        'ignore_above' => 256,
                                    ],
                                ],
                            ],
                            'position' => ['type' => 'long'],
                            'product_id' => ['type' => 'long'],
                            'status' => [
                                'type' => 'text',
                                'fields' => [
                                    'keyword' => [
                                        'type' => 'keyword',
                                        'ignore_above' => 256,
                                    ],
                                ],
                            ],
                            'thumbnail_url' => [
                                'type' => 'text',
                                'fields' => [
                                    'keyword' => [
                                        'type' => 'keyword',
                                        'ignore_above' => 256,
                                    ],
                                ],
                            ],
                            'type' => [
                                'type' => 'text',
                                'fields' => [
                                    'keyword' => [
                                        'type' => 'keyword',
                                        'ignore_above' => 256,
                                    ],
                                ],
                            ],
                            'updated_at' => ['type' => 'date'],
                            'url' => [
                                'type' => 'text',
                                'fields' => [
                                    'keyword' => [
                                        'type' => 'keyword',
                                        'ignore_above' => 256,
                                    ],
                                ],
                            ],
                        ],
                    ],
                    'cheapest_variant' => [
                        'properties' => [
                            'external_id' => [
                                'type' => 'text',
                                'fields' => [
                                    'keyword' => [
                                        'type' => 'keyword',
                                        'ignore_above' => 256,
                                    ],
                                ],
                            ],
                            'id' => ['type' => 'long'],
                            'price' => ['type' => 'long'],
                        ],
                    ],
                    'created_at' => ['type' => 'date'],
                    'external_id' => [
                        'type' => 'text',
                        'fields' => [
                            'keyword' => [
                                'type' => 'keyword',
                                'ignore_above' => 256,
                            ],
                        ],
                    ],
                    'id' => ['type' => 'long'],
                    'last_enrichment_at' => ['type' => 'date'],
                    'materials' => [
                        'type' => 'nested',
                        'properties' => [
                            'id' => ['type' => 'long'],
                            'name' => [
                                'type' => 'text',
                                'fields' => [
                                    'keyword' => [
                                        'type' => 'keyword',
                                        'ignore_above' => 256,
                                    ],
                                ],
                            ],
                            'translations' => [
                                'type' => 'nested',
                                'properties' => [
                                    'locale' => ['type' => 'keyword'],
                                    'name' => ['type' => 'text'],
                                ],
                            ],
                        ],
                    ],
                    'name_processed' => [
                        'type' => 'text',
                        'analyzer' => 'product_ngram_analyzer',
                        'search_analyzer' => 'product_search_analyzer',
                    ],
                    'name_raw' => [
                        'type' => 'text',
                        'analyzer' => 'product_ngram_analyzer',
                        'search_analyzer' => 'product_search_analyzer',
                    ],
                    'price' => ['type' => 'long'],
                    'translations' => [
                        'properties' => [
                            'description' => [
                                'type' => 'text',
                                'fields' => [
                                    'keyword' => [
                                        'type' => 'keyword',
                                        'ignore_above' => 256,
                                    ],
                                ],
                            ],
                            'locale' => [
                                'type' => 'text',
                                'fields' => [
                                    'keyword' => [
                                        'type' => 'keyword',
                                        'ignore_above' => 256,
                                    ],
                                ],
                            ],
                            'name' => [
                                'type' => 'text',
                                'analyzer' => 'product_ngram_analyzer',
                                'search_analyzer' => 'product_search_analyzer',
                                'fields' => [
                                    'keyword' => [
                                        'type' => 'keyword',
                                        'ignore_above' => 256,
                                    ],
                                ],
                            ],
                            'translated_at' => ['type' => 'date'],
                        ],
                    ],
                    'updated_at' => ['type' => 'date'],
                    'visible_category_ids' => ['type' => 'long'],
                    'variants' => [
                        'type' => 'nested',
                        'properties' => [
                            'id' => ['type' => 'long'],
                            'name' => [
                                'type' => 'text',
                                'analyzer' => 'product_ngram_analyzer',
                                'search_analyzer' => 'product_search_analyzer',
                            ],
                            'name_processed' => [
                                'type' => 'text',
                                'analyzer' => 'product_ngram_analyzer',
                                'search_analyzer' => 'product_search_analyzer',
                            ],
                            'translations' => [
                                'type' => 'nested',
                                'properties' => [
                                    'locale' => ['type' => 'keyword'],
                                    'name' => [
                                        'type' => 'text',
                                        'analyzer' => 'product_ngram_analyzer',
                                        'search_analyzer' => 'product_search_analyzer',
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ];
    }
}
