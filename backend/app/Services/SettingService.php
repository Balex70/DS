<?php

namespace App\Services;

use App\Models\Setting;
use App\Services\Settings;

class SettingService
{
    public function get(string $key): mixed
    {
        $definition = Settings::DEFINITIONS[$key];

        if (!$definition) {
            return null;
        }

        $value = Setting::where('key', $key)->value('value');

        if ($value === null) {
            return $definition['default'];
        }

        return match ($definition['type']) {
            'boolean' => filter_var($value, FILTER_VALIDATE_BOOLEAN),
            'integer' => (int) $value,
            'float' => (float) $value,
            'string' => $value,
        };
    }

    public function set(string $key, mixed $value): void
    {
        $definition = Settings::DEFINITIONS[$key] ?? null;

        if ($definition === null) {
            throw new \InvalidArgumentException(
                "Setting [{$key}] is not defined."
            );
        }

        $value = match ($definition['type']) {
            'boolean' => filter_var($value, FILTER_VALIDATE_BOOLEAN),
            'integer' => (int) $value,
            'float' => (float) $value,
            'string' => (string) $value,
            default => throw new \InvalidArgumentException(
                "Unsupported setting type [{$definition['type']}] for [{$key}]."
            ),
        };

        Setting::updateOrCreate(
            ['key' => $key],
            ['value' => (string) $value]
        );
    }
}
