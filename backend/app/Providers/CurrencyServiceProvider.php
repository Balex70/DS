<?php
namespace App\Providers;

use App\Currency\CurrencyManager;
use App\Currency\Providers\PrivatBankProvider;
use Illuminate\Support\ServiceProvider;

class CurrencyServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(CurrencyManager::class, function ($app) {
            return new CurrencyManager(
                $app->tagged('currency.providers')
            );
        });

        $this->app->tag([
            PrivatBankProvider::class,
        ], 'currency.providers');
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
