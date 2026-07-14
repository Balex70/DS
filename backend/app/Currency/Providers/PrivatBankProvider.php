<?php
namespace App\Currency\Providers;

use App\Currency\Contracts\CurrencyProviderInterface;
use App\Currency\DTO\ExchangeRate;
use App\Currency\API\PrivatBankApi;
use App\Models\Currency;

class PrivatBankProvider implements CurrencyProviderInterface
{
    public function __construct(
        private PrivatBankApi $privatBankApi,
    ) {}

    public function supports(string $from, string $to): bool
    {
        return $to === 'UAH';
    }

    public function getRate(string $from, string $to): ExchangeRate
    {
        $cur = Currency::where('from_currency', $from)->where('to_currency', $to)->first();

        return new ExchangeRate(
            from: $from,
            to: $to,
            rate: $cur->rate / ExchangeRate::SCALE,
            updatedAt: $cur->rate_updated_at,
            provider: 'privatbank',
        );
    }
    
    public function syncRate(string $from = 'USD', string $to = 'UAH'): void
    {
        $res = $this->privatBankApi->fetchUsdRate();

        $rate = (int) round($res['sale'] * ExchangeRate::SCALE);
        Currency::upsert([
            'from_currency' => $from,
            'to_currency' => $to,
            'rate' => $rate,
            'rate_updated_at' => now(),
        ], ['from_currency', 'to_currency'], ['rate', 'rate_updated_at']);
    }
}
