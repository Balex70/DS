<?php
namespace App\Providers;

use App\Payments\Gateways\LiqPay\LiqPayGateway;
use App\Payments\Gateways\Stripe\StripeGateway;
use App\Payments\Gateways\WayForPay\WayForPayGateway;
use App\Payments\PaymentManager;
use Illuminate\Support\ServiceProvider;

class PaymentServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(PaymentManager::class, function ($app) {
            return new PaymentManager(
                $app->tagged('payment.gateways')
            );
        });

        $this->app->tag([
            StripeGateway::class,
            WayForPayGateway::class,
            LiqPayGateway::class
        ], 'payment.gateways');
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
