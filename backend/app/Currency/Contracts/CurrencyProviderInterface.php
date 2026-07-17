<?php
namespace App\Currency\Contracts;

use App\Currency\DTO\ExchangeRate;
use App\Enums\CurrenciesEnum;

interface CurrencyProviderInterface
{
    public function supports(string $from, string $to): bool;
    
    public function getRate(string $from, string $to): ExchangeRate | null;
    
    public function syncRate(CurrenciesEnum $from, CurrenciesEnum $to): void;
}
