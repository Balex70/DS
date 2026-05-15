<?php

namespace Tests\Feature\Commands;

use Illuminate\Support\Facades\Queue;
use App\Jobs\EnrichProductJob;
use Tests\TestCase;

class EnrichProductCommandTest extends TestCase
{
    public function test_dispatches_enrich_product_job()
    {
        Queue::fake();

        $this->artisan('app:enrich-product')
            ->assertExitCode(0);

        Queue::assertPushed(EnrichProductJob::class);
    }
}
