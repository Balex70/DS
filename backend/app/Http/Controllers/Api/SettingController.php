<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SettingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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

    public function update(Request $request): JsonResponse
    {
        foreach ($request->all() as $key => $value) {
            $this->settingService->set($key, $value);
        }

        return response()->json([
            'message' => 'Settings updated successfully.',
        ]);
    }
}
