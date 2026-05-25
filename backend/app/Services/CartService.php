<?php

namespace App\Services;

use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Str;

class CartService
{
    private function key(string $token): string
    {
        return "cart:{$token}";
    }

    public function getOrCreateToken(?string $token): string
    {
        return $token ?? Str::random(32);
    }

    public function get(string $token): array
    {
        $data = Redis::get($this->key($token));

        return $data ? json_decode($data, true) : [
            'items' => [],
        ];
    }

    public function save(string $token, array $cart): void
    {
        Redis::setex(
            $this->key($token),
            60 * 60 * 24 * 30, // 30 days TTL
            json_encode($cart)
        );
    }

    public function addItem(string $token, array $item): array
    {
        $cart = $this->get($token);

        // simple merge logic (you can improve later)
        $cart['items'][] = $item;

        $this->save($token, $cart);

        return $cart;
    }

    public function clear(string $token): void
    {
        Redis::del($this->key($token));
    }
}
