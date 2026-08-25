<?php

namespace Tests\Feature\Controllers;

use App\Models\Category;
use App\Models\User;
use App\Policies\CategoryPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class CategoryControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $superadmin;
    protected User $admin;
    protected User $editor;

    protected function setUp(): void
    {
        parent::setUp();

        $this->superadmin = User::where(
            'email',
            env('SUPER_ADMIN_EMAIL', 'admin@mail.com')
        )->firstOrFail();
        $this->admin = User::factory()->admin()->create();
        $this->editor = User::factory()->editor()->create();
    }

    #[DataProvider('index_returns_categories_provider')]
    public function test_index_returns_categories($userType)
    {
        match($userType) {
            'superadmin' => $user = $this->superadmin,
            'admin' => $user = $this->admin,
            'editor' => $user = $this->editor,
        };
        
        $this->assertDatabaseHas('users', [
            'email' => $user->email,
        ]);
        
        $this->app->make(\Illuminate\Contracts\Auth\Access\Gate::class)
            ->policy(Category::class, CategoryPolicy::class);

        Category::factory()->count(2)->create();

        $this->actingAs($user);
        $response = $this->getJson('/api/categories');
                 
        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    ['id', 'name'],
                ]
            ]);
    }

    public static function index_returns_categories_provider(): array
    {
        return [
            'Super admin' => ['superadmin'],
            'Regular admin' => ['admin'],
            'Editor' => ['editor'],
        ];
    }
    
    public function test_index_denied_without_permission()
    {
        $user = User::factory()->unverified()->create();
        $this->actingAs($user);

        Gate::shouldReceive('authorize')
            ->once()
            ->andThrow(new \Illuminate\Auth\Access\AuthorizationException());

        $response = $this->getJson('/api/categories');

        $response->assertForbidden();
    }
    
    #[DataProvider('index_returns_categories_provider')]
    public function test_updates_category($userType)
    {
        match($userType) {
            'superadmin' => $user = $this->superadmin,
            'admin' => $user = $this->admin,
            'editor' => $user = $this->editor,
        };
        $this->actingAs($user);

        $category = Category::factory()->create([
            'name' => 'Old',
        ]);

        $response = $this->putJson("/api/categories/{$category->id}", [
            'translations' => [
                'en' => [
                    'name' => 'New Name',
                    'description' => 'New description',
                ],
            ],
        ]);

        $response->assertOk()
            ->assertJsonFragment([
                'name' => 'New Name',
            ]);

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'New Name',
        ]);
    }
    
    #[DataProvider('index_returns_categories_provider')]
    public function test_updates_category_translations($userType)
    {
        match($userType) {
            'superadmin' => $user = $this->superadmin,
            'admin' => $user = $this->admin,
            'editor' => $user = $this->editor,
        };
        $this->actingAs($user);

        $category = Category::factory()->create([
            'name' => 'Old',
        ]);

        $response = $this->putJson("/api/categories/{$category->id}", [
            'translations' => [
                'en' => [
                    'name' => 'New Name',
                    'description' => 'English description',
                ],
                'uk' => [
                    'name' => 'Нова назва',
                    'description' => 'Український опис',
                ],
            ],
        ]);

        $response->assertOk();

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'New Name',
            'description' => 'English description',
        ]);

        $this->assertDatabaseHas('category_translations', [
            'category_id' => $category->id,
            'locale' => 'uk',
            'name' => 'Нова назва',
            'description' => 'Український опис',
        ]);
    }
    
    #[DataProvider('index_returns_categories_provider')]
    public function test_bulk_activate_categories($userType)
    {
        match($userType) {
            'superadmin' => $user = $this->superadmin,
            'admin' => $user = $this->admin,
            'editor' => $user = $this->editor,
        };
        $this->actingAs($user);

        $cat1 = Category::factory()->create();
        $cat2 = Category::factory()->create();

        $response = $this->postJson('/api/categories/bulk-activate', [
            'ids' => [$cat1->id],
            'active' => true,
        ]);

        $response->assertOk()
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('categories', [
            'id' => $cat1->id,
            'active' => true,
        ]);

        $this->assertDatabaseHas('categories', [
            'id' => $cat2->id,
            'active' => false,
        ]);
    }

    // public function test_superadmin_can_delete_category()
    // {
    //     $user = User::factory()->superAdmin()->create();
    //     $this->actingAs($user);

    //     $category = Category::factory()->create();

    //     $response = $this->deleteJson("/api/categories/{$category->id}");

    //     $response->assertOk();

    //     $this->assertDatabaseMissing('categories', [
    //         'id' => $category->id,
    //     ]);
    // }
}
