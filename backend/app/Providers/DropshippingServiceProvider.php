<?php

namespace App\Providers;

use App\Dropshipping\Providers\CjDropshippingProvider;
use App\Dropshipping\DropshippingManager;
use Illuminate\Support\ServiceProvider;
class DropshippingServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(DropshippingManager::class, function ($app) {
            return new DropshippingManager(
                $app->tagged('dropshipping.providers')
            );
        });

        $this->app->tag([
            CjDropshippingProvider::class, // add here another provider if needed
        ], 'dropshipping.providers');
    }
    
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
