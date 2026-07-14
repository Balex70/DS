<?php
namespace App\Currency;

use App\Currency\DTO\ExchangeRate;

class CurrencyManager
{
    public function __construct(protected iterable $providers)
    {
    }

    public function getRate(string $from, string $to): ExchangeRate
    {
        foreach ($this->providers as $provider) {
            if ($provider->supports($from, $to)) {
                return $provider->getRate($from, $to);
            }
        }

        throw new \Exception("No provider supports {$from} -> {$to}");
    }
    
    public function syncRate(): void
    {
        foreach ($this->providers as $provider) {
            $provider->syncRate();
        }
    }
}
