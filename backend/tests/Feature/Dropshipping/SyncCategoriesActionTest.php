<?php

namespace Tests\Feature\Dropshipping;

use App\Dropshipping\Actions\SyncCategoriesAction;
use App\Dropshipping\Contracts\DropshippingProviderInterface;
use App\Dropshipping\DropshippingManager;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SyncCategoriesActionTest extends TestCase
{
    use RefreshDatabase;

    public function test_sync_creates_categories()
    {
        $provider = $this->mock(DropshippingProviderInterface::class);

        $provider->shouldReceive('getName')
            ->andReturn('cj');

        $provider->shouldReceive('getCategories')
            ->once()
            ->andReturn([
                (object)[
                    'externalId' => 'cat-1',
                    'name' => 'Electronics',
                    'parentId' => null,
                ],
            ]);

        $manager = $this->mock(DropshippingManager::class);
        $manager->shouldReceive('driver')->andReturn($provider);

        $action = $this->app->make(SyncCategoriesAction::class);

        $action->execute();

        $this->assertDatabaseHas('categories', [
            'external_id' => 'cat-1',
            'name' => 'Electronics',
            'provider' => 'cj',
            'parent_id' => null,
        ]);
    }

    public function test_sync_updates_existing_category()
    {
        Category::factory()->create([
            'external_id' => 'cat-1',
            'provider' => 'cj',
            'name' => 'Old name',
        ]);

        $provider = $this->mock(DropshippingProviderInterface::class);

        $provider->shouldReceive('getName')
            ->andReturn('cj');

        $provider->shouldReceive('getCategories')
            ->andReturn([
                (object)[
                    'externalId' => 'cat-1',
                    'name' => 'New name',
                    'parentId' => null,
                ],
            ]);

        $manager = $this->mock(DropshippingManager::class);
        $manager->shouldReceive('driver')->andReturn($provider);

        $action = $this->app->make(SyncCategoriesAction::class);

        $action->execute();

        $this->assertDatabaseHas('categories', [
            'external_id' => 'cat-1',
            'name' => 'New name',
            'parent_id' => null,
        ]);
    }

    public function test_sync_sets_parent_relationships()
    {
        $provider = $this->mock(DropshippingProviderInterface::class);

        $provider->shouldReceive('getName')
            ->andReturn('cj');

        $provider->shouldReceive('getCategories')
            ->andReturn([
                (object)[
                    'externalId' => 'parent-1',
                    'name' => 'Parent',
                    'parentId' => null,
                ],
                (object)[
                    'externalId' => 'child-1',
                    'name' => 'Child',
                    'parentId' => 'parent-1',
                ],
            ]);

        $manager = $this->mock(DropshippingManager::class);
        $manager->shouldReceive('driver')->andReturn($provider);

        $action = $this->app->make(SyncCategoriesAction::class);

        $action->execute();

        $this->assertDatabaseHas('categories', [
            'external_id' => 'parent-1',
            'name' => 'Parent',
            'parent_id' => null,
        ]);
        
        $parent = Category::where('external_id', 'parent-1')->first();
        
        $this->assertDatabaseHas('categories', [
            'external_id' => 'child-1',
            'name' => 'Child',
            'parent_id' => $parent->id,
        ]);
    }
}
