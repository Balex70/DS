<?php

namespace App\Currency\Services;

use App\Currency\CurrencyManager;

class PriceConverter
{
    public function __construct(
        private CurrencyManager $currencyManager,
    ) {
    }

    /**
     * Convert an integer amount between currencies.
     *
     * Amount should be in the smallest unit (cents, øre, etc.)
     */
    public function convert(
        int $amount,
        string $from,
        string $to,
    ): int | null {
        if ($from === $to) {
            return $amount;
        }

        $rate = $this->currencyManager->getRate($from, $to);
        if (!$rate) {
            return null;
        }

        return (int) round($amount * $rate->rate);
    }
}
