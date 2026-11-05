<?php

namespace App\SearchEngine;

use App\SearchEngine\Contracts\SearchEngineInterface;

class SearchEngineManager
{
    protected array $engines = [];

    public function __construct(iterable $engines)
    {
        foreach ($engines as $engine) {
            $this->engines[$engine->getName()] = $engine;
        }
    }

    public function driver(?string $name = null): SearchEngineInterface
    {
        $name = $name ?? config('search.default', 'opensearch');

        if (!isset($this->engines[$name])) {
            throw new \Exception("Unsupported search engine [$name]");
        }

        return $this->engines[$name];
    }

    public function all(): array
    {
        return $this->engines;
    }
}
