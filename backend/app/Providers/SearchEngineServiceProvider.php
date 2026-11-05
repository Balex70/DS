<?php

namespace App\Providers;

use App\SearchEngine\Providers\OpenSearch\OpenSearchProvider;
use App\SearchEngine\SearchEngineManager;
use Illuminate\Support\ServiceProvider;
use OpenSearch\GuzzleClientFactory;

class SearchEngineServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(GuzzleClientFactory::class);
        $this->app->singleton(OpenSearchProvider::class);

        $this->app->tag(
            [OpenSearchProvider::class],
            'searchEngine.provider'
        );
        
        $this->app->singleton(
            SearchEngineManager::class,
            fn ($app) => new SearchEngineManager(
                $app->tagged('searchEngine.provider')
            )
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
