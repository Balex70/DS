<?php

namespace App\Dropshipping\API;

use Illuminate\Support\Facades\Http;
use App\Dropshipping\Services\CjAuthService;
class CjApiClient
{
    private string $baseUrl = 'https://developers.cjdropshipping.com/api2.0/v1';

    public function __construct(
        private CjAuthService $authService
    ) {}

    public function getCategories(): array
    {
        $token = $this->authService->getValidAccessToken();
        if(!$token) {
            throw new \Exception('CJ authentication failed: no valid token available');
        }

        $response = Http::withHeaders([
            'CJ-Access-Token' => $token,
            'Accept' => 'application/json',
        ])->get("{$this->baseUrl}/product/getCategory");

        $json = $response->json();

        if (!isset($json['code']) || $json['code'] !== 200) {
            throw new \Exception('CJ API error: ' . ($json['message'] ?? 'Unknown error'));
        }

        return $json['data'] ?? [];
    }

    public function getProducts(string $categoryId, int $page, int $size = 10): array
    {
        $token = $this->authService->getValidAccessToken();
        if(!$token) {
            throw new \Exception('CJ authentication failed: no valid token available');
        }

        $response = Http::withHeaders([
            'CJ-Access-Token' => $token,
            'Accept' => 'application/json',
        ])->get("{$this->baseUrl}/product/listV2", [
            'categoryId' => $categoryId,
            'page' => $page,
            'size' => $size
        ]);

        $json = $response->json();

        if (!isset($json['code']) || $json['code'] !== 200) {
            throw new \Exception('CJ API error: ' . ($json['message'] ?? 'Unknown error'));
        }

        return $json['data'] ?? [];
    }

    public function getProductDetails(string $externalProductId): array
    {
        $token = $this->authService->getValidAccessToken();
        if(!$token) {
            throw new \Exception('CJ authentication failed: no valid token available');
        }

        $response = Http::withHeaders([
            'CJ-Access-Token' => $token,
            'Accept' => 'application/json',
        ])->get("{$this->baseUrl}/product/query", [
            'pid' => $externalProductId
        ]);

        $json = $response->json();

        if (!isset($json['code']) || $json['code'] !== 200) {
            throw new \Exception('CJ API error: ' . ($json['message'] ?? 'Unknown error'));
        }

        return $json['data'] ?? [];
    }

    public function calculateShipping(array $payload): array
    {
        $token = $this->authService->getValidAccessToken();

        if (!$token) {
            throw new \Exception('CJ authentication failed: no valid token available');
        }

        $response = Http::withHeaders([
            'CJ-Access-Token' => $token,
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
        ])->post("{$this->baseUrl}/logistic/freightCalculate", $payload); // freightCalculateTip doesn't work as expected, so use simpler freightCalculate

        $json = $response->json();

        if (!isset($json['code']) || $json['code'] !== 200) {
            throw new \Exception('CJ Shipping API error: ' . ($json['message'] ?? 'Unknown error'));
        }

        return $json['data'] ?? [];
    }

    public function createOrder(array $payload): array
    {
        $token = $this->authService->getValidAccessToken();

        if (!$token) {
            throw new \Exception('CJ authentication failed: no valid token available');
        }

        $response = Http::withHeaders([
            'CJ-Access-Token' => $token,
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
        ])->post(
            "{$this->baseUrl}/shopping/order/createOrderV3",
            $payload
        );

        $json = $response->json();

        if (!isset($json['code']) || $json['code'] !== 200) {
            throw new \Exception(
                'CJ Order API error: ' . ($json['message'] ?? 'Unknown error')
            );
        }

        return $json['data'] ?? [];
    }

    public function checkOrderStatus(int $orderId): array
    {
        $token = $this->authService->getValidAccessToken();

        if (!$token) {
            throw new \Exception('CJ authentication failed: no valid token available');
        }

        $response = Http::withHeaders([
            'CJ-Access-Token' => $token,
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
        ])->get(
            "{$this->baseUrl}/shopping/order/getOrderDetail",
            [
                'orderId' => $orderId
            ]
        );

        $json = $response->json();

        if (!isset($json['code']) || $json['code'] !== 200) {
            return [
                'success' => false,
                'message' => $json['message'] ?? 'Unknown error',
                'data' => null,
            ];
        }

        return [
            'success' => true,
            'message' => null,
            'data' => $json['data'] ?? [],
        ];
    }

    public function getTrackInfo(int $trackNumber): array
    {
        $token = $this->authService->getValidAccessToken();

        if (!$token) {
            throw new \Exception('CJ authentication failed: no valid token available');
        }

        // For testing
        // return [
        //     'success' => true,
        //     'message' => null,
        //     'data' => [
        //         'trackingNumber' => 'CJPKL7160102171YQ',
        //         'logisticName' => 'CJPacket Sensitive',
        //         'trackingFrom' => 'CN',
        //         'trackingTo' => 'US',
        //         'deliveryDay' => '13',
        //         'deliveryTime' => '2021-06-17 07:04:04',
        //         'trackingStatus' => 'In transit',
        //         'lastMileCarrier' => 'UPS',
        //         'lastTrackNumber' => '926112903032124',
        //     ],
        // ];

        $response = Http::withHeaders([
            'CJ-Access-Token' => $token,
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
        ])->get(
            "{$this->baseUrl}/logistic/trackInfo",
            [
                'trackNumber' => $trackNumber
            ]
        );

        $json = $response->json();

        if (!isset($json['code']) || $json['code'] !== 200) {
            return [
                'success' => false,
                'message' => $json['message'] ?? 'Unknown error',
                'data' => null,
            ];
        }

        return [
            'success' => true,
            'message' => null,
            'data' => $json['data'] ?? [],
        ];
    }

    public function simulatePayOrder(string $orderId): array
    {
        $token = $this->authService->getValidAccessToken();

        if (!$token) {
            throw new \Exception('CJ authentication failed: no valid token available');
        }

        $response = Http::withHeaders([
            'CJ-Access-Token' => $token,
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
        ])->post(
            "{$this->baseUrl}/shopping/sandbox/simulatePay",
            [
                'orderId' => $orderId
            ]
        );

        $json = $response->json();

        if (!isset($json['code']) || $json['code'] !== 200) {
            return [
                'success' => false,
                'message' => $json['message'] ?? 'Unknown error',
                'data' => null,
            ];
        }

        return [
            'success' => true,
            'message' => null,
            'data' => $json['data'] ?? [],
        ];
    }
}
