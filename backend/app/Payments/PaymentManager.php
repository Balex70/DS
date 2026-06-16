<?php
namespace App\Payments;

use App\Payments\Contracts\PaymentGatewayInterface;

class PaymentManager
{
    protected array $gateways = [];

    public function __construct(iterable $gateways)
    {
        foreach ($gateways as $gateway) {
            $this->gateways[$gateway->getName()] = $gateway;
        }
    }

    public function driver(?string $name = null): PaymentGatewayInterface
    {
        $name = $name ?? config('payments.default', 'stripe');

        if (!$name) {
            throw new \Exception("No default payment gateway configured");
        }

        if (!isset($this->gateways[$name])) {
            throw new \Exception("Unsupported payment gateway [$name]");
        }

        return $this->gateways[$name];
    }

    public function availableGateway(
        string $country,
        ?string $currency = null,
        array $methods = []
    ): ?PaymentGatewayInterface {
        $available = collect($this->gateways)
            ->filter(fn ($gateway) =>
                $gateway->isAvailable(
                    $country,
                    $currency,
                    $methods
                )
            )
            ->sortByDesc(fn ($gateway) =>
                $gateway->getPriority()
            );

        return $available->first();
    }

    public function all(): array
    {
        return $this->gateways;
    }
}
