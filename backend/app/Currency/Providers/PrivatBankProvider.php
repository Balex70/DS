<?php
namespace App\Currency\Providers;

use App\Currency\API\PrivatBankApi;
use App\Currency\Contracts\CurrencyProviderInterface;
use App\Currency\DTO\ExchangeRate;
use App\Enums\CurrenciesEnum;
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

    public function getRate(string $from, string $to): ExchangeRate | null
    {
        $cur = Currency::where('from_currency', $from)->where('to_currency', $to)->first();
        if (!$cur) {
            return null;
        }

        return new ExchangeRate(
            from: $from,
            to: $to,
            rate: $cur->rate / ExchangeRate::SCALE,
            rateUpdatedAt: $cur->rate_updated_at,
            provider: 'privatbank',
        );
    }
    
    public function syncRate(CurrenciesEnum $from = CurrenciesEnum::USD, CurrenciesEnum $to = CurrenciesEnum::UAH): void
    {
        $res = $this->privatBankApi->fetchUsdRate();

        $rate = (int) round($res['sale'] * ExchangeRate::SCALE);
        Currency::upsert([
            'from_currency' => $from->value,
            'to_currency' => $to->value,
            'rate' => $rate,
            'rate_updated_at' => now(),
        ], ['from_currency', 'to_currency'], ['rate', 'rate_updated_at']);
    }
}
