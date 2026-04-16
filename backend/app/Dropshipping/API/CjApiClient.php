<?php

namespace App\Dropshipping\API;

use Illuminate\Support\Facades\Http;
class CjApiClient
{
    private string $baseUrl = 'https://developers.cjdropshipping.com/api2.0/v1';

    public function getCategories(): array
    {
        $response = Http::withHeaders([
            'CJ-Access-Token' => '!change-me!',
            'Accept' => 'application/json',
        ])->get("{$this->baseUrl}/product/getCategory");

        $json = $response->json();

        if (!isset($json['code']) || $json['code'] !== 200) {
            throw new \Exception('CJ API error: ' . ($json['message'] ?? 'Unknown error'));
        }

        return $json['data'] ?? [];
    }

    public function getProducts(array $filters): array
    {
        return Http::get(...)->json();
    }
}
