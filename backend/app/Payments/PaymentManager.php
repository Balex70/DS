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
}
