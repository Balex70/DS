<?php

namespace App\Currency\API;

use Illuminate\Support\Facades\Http;

class PrivatBankApi
{
    private string $baseUrl = 'https://api.privatbank.ua/p24api';

    public function fetchUsdRate(): array
    {
        $apiResponse = Http::get("{$this->baseUrl}/pubinfo", [
            'json' => '',
            'exchange' => '',
            'coursid' => 11,
        ]);

        if ($apiResponse->failed()) {
            throw new \Exception(
                "PrivatBank API returned: {$apiResponse->status()}"
            );
        }

        $usd = collect($apiResponse->json())
            ->firstWhere('ccy', 'USD');

        if (!$usd) {
            throw new \Exception('USD exchange rate not found.');
        }

        return $usd;
    }
}
