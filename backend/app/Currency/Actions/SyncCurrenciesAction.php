<?php

namespace App\Currency\Actions;

use App\Currency\CurrencyManager;

class SyncCurrenciesAction
{
    public function __construct(
        private CurrencyManager $manager
    ) {}

    public function execute(): void
    {
        $this->manager->syncRate();
    }
}
