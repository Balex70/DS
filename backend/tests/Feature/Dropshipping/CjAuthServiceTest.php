<?php

namespace Tests\Feature\Dropshipping;

use App\Dropshipping\Services\CjAuthService;
use App\Models\CjToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class CjAuthServiceTest extends TestCase
{
    use RefreshDatabase;
    public function test_returns_valid_token_from_database()
    {
        CjToken::factory()->create([
            'access_token' => 'valid-token',
            'refresh_token' => 'refresh',
            'access_expires_at' => now()->addHour(),
        ]);

        $service = new CjAuthService();

        $token = $service->getValidAccessToken();

        $this->assertEquals('valid-token', $token);
    }
    public function test_refreshes_token_when_expired()
    {
        CjToken::factory()->create([
            'access_token' => 'old',
            'refresh_token' => 'refresh',
            'access_expires_at' => now()->subHour(),
        ]);

        Http::fake([
            '*/refreshAccessToken' => Http::response([
                'code' => 200,
                'data' => [
                    'accessToken' => 'new-token',
                    'refreshToken' => 'new-refresh',
                    'accessTokenExpiryDate' => now()->addHour()->toISOString(),
                    'refreshTokenExpiryDate' => now()->addDay()->toISOString(),
                ]
            ], 200),
        ]);

        $service = new CjAuthService();

        $token = $service->getValidAccessToken();

        $this->assertEquals('new-token', $token);
        $this->assertDatabaseHas('cj_tokens', [
            'access_token' => 'new-token',
        ]);
    }

    public function test_reauth_when_refresh_fails()
    {
        CjToken::factory()->create([
            'access_token' => 'old',
            'refresh_token' => 'refresh',
            'access_expires_at' => now()->subHour(),
        ]);

        Http::fake([
            '*/refreshAccessToken' => Http::response([
                'code' => 500,
                'message' => 'refresh failed'
            ], 200),

            '*/getAccessToken' => Http::response([
                'code' => 200,
                'data' => [
                    'accessToken' => 'reauth-token',
                    'refreshToken' => 'reauth-refresh',
                    'accessTokenExpiryDate' => now()->addHour()->toISOString(),
                    'refreshTokenExpiryDate' => now()->addDay()->toISOString(),
                ]
            ], 200),
        ]);

        $service = new CjAuthService();

        $token = $service->getValidAccessToken();

        $this->assertEquals('reauth-token', $token);
        $this->assertDatabaseHas('cj_tokens', [
            'access_token' => 'reauth-token',
        ]);
    }

    public function test_throws_when_auth_fails()
    {
        CjToken::factory()->create([
            'access_token' => 'old',
            'refresh_token' => 'refresh',
            'access_expires_at' => now()->subHour(),
        ]);

        Http::fake([
            '*' => Http::response([
                'code' => 500,
                'message' => 'error'
            ], 200),
        ]);

        $service = new CjAuthService();

        $this->expectException(\Exception::class);

        $service->getValidAccessToken();
    }
}
