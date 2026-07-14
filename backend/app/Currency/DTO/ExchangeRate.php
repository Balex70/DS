<?php
namespace App\Currency\DTO;

class ExchangeRate
{
    public const SCALE = 1_000_000;
    public function __construct(
        public readonly string $from,
        public readonly string $to,
        public readonly float $rate,
        public readonly \DateTimeInterface $updatedAt,
        public readonly string $provider,
    ) {}
}
