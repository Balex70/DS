<?php
namespace App\Currency\Contracts;

use App\Currency\DTO\ExchangeRate;

interface CurrencyProviderInterface
{
    public function supports(string $from, string $to): bool;
    
    public function getRate(string $from, string $to): ExchangeRate;
    
    public function syncRate(string $from, string $to): void;
}
