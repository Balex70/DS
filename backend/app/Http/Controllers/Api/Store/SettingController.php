<?php

namespace App\Http\Controllers\Api\Store;

use App\Http\Controllers\Controller;
use App\Services\SettingService;
use Illuminate\Http\JsonResponse;

class SettingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function __construct(
        private readonly SettingService $settingService
    ) {}

    public function index(): JsonResponse
    {
        $settings = [];

        foreach (array_keys(\App\Services\Settings::DEFINITIONS) as $key) {
            $settings[$key] = $this->settingService->get($key);
        }

        return response()->json($settings);
    }
}
