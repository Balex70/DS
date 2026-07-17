<?php
namespace App\Currency;

use App\Currency\DTO\ExchangeRate;

class CurrencyManager
{
    public function __construct(protected iterable $providers)
    {
    }

    public function getRate(string $from, string $to): ExchangeRate | null
    {
        foreach ($this->providers as $provider) { // TODO: cache
            if (! $provider->supports($from, $to)) {
                continue;
            }

            $rate = $provider->getRate($from, $to);

            if ($rate !== null) {
                return $rate;
            }
        }

        return null;
    }
    
    public function syncRate(): void
    {
        foreach ($this->providers as $provider) {
            $provider->syncRate();
        }
    }
}
