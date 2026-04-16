<?php
namespace App\Dropshipping;

use App\Dropshipping\Contracts\DropshippingProviderInterface;

class DropshippingManager
{
    protected array $providers = [];

    public function __construct(iterable $providers)
    {
        foreach ($providers as $provider) {
            $this->providers[$provider->getName()] = $provider;
        }
    }

    public function driver(?string $name = null): DropshippingProviderInterface
    {
        $name = $name ?? config('dropshipping.default', 'cj');

        if (!$name) {
            throw new \Exception("No default dropshipping provider configured");
        }

        if (!isset($this->providers[$name])) {
            throw new \Exception("Unsupported provider [$name]");
        }

        return $this->providers[$name];
    }
}
