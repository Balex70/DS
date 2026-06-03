<?php
namespace App\Payments\Gateways;

use App\Payments\Contracts\PaymentGatewayInterface;

abstract class AbstractGateway implements PaymentGatewayInterface
{
    protected function log(array $data): void
    {
        logger()->info(static::class, $data);
    }
}
