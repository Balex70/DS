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

    /**
     * NEW: context-based selection
     */
    public function resolve(
        string $country,
        ?string $currency = null,
        array $methods = []
    ): PaymentGatewayInterface {
        foreach ($this->gateways as $gateway) {
            if ($gateway->isAvailable($country, $currency, $methods)) {
                return $gateway;
            }
        }

        throw new \Exception("No available payment gateway for [$country]");
    }

    public function all(): array
    {
        return $this->gateways;
    }
}
