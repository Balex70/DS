<?php

namespace App\Dropshipping\Services;

use App\Models\CjToken;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class CjAuthService
{
    private string $baseUrl = 'https://developers.cjdropshipping.com/api2.0/v1/authentication';

    public function getValidAccessToken(): string|null
    {
        $token = $this->getStoredToken();

        if ($this->isAccessTokenValid($token)) {
            return $token->access_token;
        }

        if ($token && $token = $this->refreshToken($token)) {
            return $token->access_token;
        }

        if ($token = $this->reAuth()) {
            return $token->access_token;
        }

        throw new \Exception('CJ authentication failed: no valid token available');
    }
    
    private function getStoredToken(): CjToken|null
    {
        // get token from DB
        return CjToken::first();
    }

    private function isAccessTokenValid($token): bool
    {
        return $token && now()->lt($token->access_expires_at);
    }

    private function refreshToken($token): CjToken|null
    {
        $refreshResponse = Http::withHeaders([
            'Accept' => 'application/json',
        ])->post("{$this->baseUrl}/refreshAccessToken", [
            'refreshToken' => $token->refresh_token
        ]);

        $json = $refreshResponse->json();

        if (!isset($json['code']) || $json['code'] !== 200) {
            return null;
        }

        $token = Cache::lock('cj-token-refresh', 10)->block(5, function () use($json) {
            $model = CjToken::first();

            $model->update([
                'access_token' => $json['data']['accessToken'],
                'refresh_token' => $json['data']['refreshToken'],
                'access_expires_at' => $json['data']['accessTokenExpiryDate'],
                'refresh_expires_at' => $json['data']['refreshTokenExpiryDate'],
            ]);

            return $model;
        });

        return $token;
    }
    
    private function reAuth(): CjToken|null
    {
        $authResponse = Http::withHeaders([
            'Accept' => 'application/json',
        ])->post("{$this->baseUrl}/getAccessToken", [
            'apiKey' => config('services.cj.api_key'),
        ]);

        $json = $authResponse->json();

        if (!isset($json['code']) || $json['code'] !== 200) {
            throw new \Exception('CJ API error on reAuth: ' . ($json['message'] ?? 'Unknown error'));
        }

        $token = Cache::lock('cj-token-reauth', 10)->block(5, function () use($json) {
            $model = CjToken::updateOrCreate([
                'access_token' => $json['data']['accessToken'],
                'refresh_token' => $json['data']['refreshToken'],
                'access_expires_at' => $json['data']['accessTokenExpiryDate'],
                'refresh_expires_at' => $json['data']['refreshTokenExpiryDate']
            ]);

            return $model;
        });

        return $token;
    }
}
