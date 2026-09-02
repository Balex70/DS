<?php

namespace Tests\Feature\Controllers;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class UserControllerTest extends TestCase
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
            'superadmin@test.com'
        )->firstOrFail();
        $this->admin = User::factory()->admin()->create();
        $this->editor = User::factory()->editor()->create();
    }

    // INDEX TESTS
    public function test_superadmin_can_view_users()
    {
        User::factory()->count(3)->create();

        $response = $this->actingAs($this->superadmin)
            ->getJson('/api/users');

        $response
            ->assertOk()
            ->assertJsonStructure([
                'data',
            ]);
    }
    
    public function test_admin_can_view_users()
    {
        User::factory()->count(3)->create();

        $response = $this->actingAs($this->admin)
            ->getJson('/api/users');

        $response
            ->assertOk()
            ->assertJsonStructure([
                'data',
            ]);
    }

    public function test_editor_cannot_view_users()
    {
        $response = $this->actingAs($this->editor)
            ->getJson('/api/users');

        $response->assertForbidden();
    }
    
    // CREATE TESTS
    public function test_superadmin_can_create_user()
    {
        Role::firstOrCreate(['name' => 'test admin']);

        $response = $this->actingAs($this->superadmin)
            ->postJson('/api/users', [
                'name' => 'John',
                'email' => 'john@example.com',
                'password' => 'password',
                'password_confirmation' => 'password',
                'role' => 'admin',
            ]);

        $response->assertCreated();

        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com',
        ]);

        $user = User::where('email', 'john@example.com')->first();

        $this->assertTrue($user->hasRole('admin'));
        $this->assertTrue(Hash::check('password', $user->password));
    }
    
    public function test_admin_can_create_user()
    {
        Role::firstOrCreate(['name' => 'test admin']);

        $response = $this->actingAs($this->admin)
            ->postJson('/api/users', [
                'name' => 'John',
                'email' => 'john@example.com',
                'password' => 'password',
                'password_confirmation' => 'password',
                'role' => 'admin',
            ]);

        $response->assertCreated();

        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com',
        ]);

        $user = User::where('email', 'john@example.com')->first();

        $this->assertTrue($user->hasRole('admin'));
        $this->assertTrue(Hash::check('password', $user->password));
    }

    public function test_editor_cannot_create_user()
    {
        $response = $this->actingAs($this->editor)
            ->postJson('/api/users', [
                'name' => 'John',
                'email' => 'john@example.com',
                'password' => 'password',
                'password_confirmation' => 'password',
                'role' => 'admin',
            ]);

        $response->assertForbidden();
    }
    
    // SHOW TESTS
    public function test_superadmin_can_view_single_user()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($this->superadmin)
            ->getJson("/api/users/{$user->id}");

        $response
            ->assertOk()
            ->assertJson([
                'data' => [
                    'id' => $user->id,
                ],
            ]);
    }
    
    public function test_editor_cannot_view_single_user()
    {
        $user = User::factory()->create();
    
        $response = $this->actingAs($this->editor)
            ->getJson("/api/users/{$user->id}");

        $response->assertForbidden();
    }
    
    // UPDATE TESTS
    public function test_superadmin_can_update_any_user()
    {
        $targetUser = User::factory()->editor()->create([
            'name' => 'Original Name',
        ]);

        $response = $this->actingAs($this->superadmin)
            ->putJson("/api/users/{$targetUser->id}", [
                'name' => 'Updated By Superadmin',
                'email' => $targetUser->email,
                'role' => 'admin',
            ]);

        $response->assertOk();

        $targetUser->refresh();

        $this->assertEquals('Updated By Superadmin', $targetUser->name);
        $this->assertTrue($targetUser->hasRole('admin'));
    }
    
    public function test_admin_can_update_other_user()
    {
        $targetUser = User::factory()->editor()->create([
            'name' => 'Original Name',
        ]);

        $response = $this->actingAs($this->admin)
            ->putJson("/api/users/{$targetUser->id}", [
                'name' => 'Updated By Admin',
                'email' => $targetUser->email,
                'role' => 'admin',
            ]);

        $response->assertOk();

        $targetUser->refresh();

        $this->assertEquals('Updated By Admin', $targetUser->name);
    }
    
    public function test_admin_cannot_update_self()
    {
        $originalName = $this->admin->name;

        $response = $this->actingAs($this->admin)
            ->putJson("/api/users/{$this->admin->id}", [
                'name' => 'Updated Self',
                'email' => $this->admin->email,
                'role' => 'admin',
            ]);

        $response->assertForbidden();

        $this->admin->refresh();

        $this->assertEquals($originalName, $this->admin->name);
    }

    public function test_editor_cannot_update_self()
    {
        $originalName = $this->editor->name;

        $response = $this->actingAs($this->editor)
            ->putJson("/api/users/{$this->editor->id}", [
                'name' => 'Updated Self',
                'email' => $this->editor->email,
                'role' => 'editor',
            ]);

        $response->assertForbidden();

        $this->editor->refresh();

        $this->assertEquals($originalName, $this->editor->name);
    }
    
    public function test_editor_cannot_update_other_user()
    {
        $targetUser = User::factory()->create();

        $response = $this->actingAs($this->editor)
            ->putJson("/api/users/{$targetUser->id}", [
                'name' => 'Should Fail',
                'email' => $targetUser->email,
                'role' => 'editor',
            ]);

        $response->assertForbidden();
    }
    
    // DELETE TESTS
    public function test_superadmin_can_delete_user()
    {
        $target = User::factory()->create();

        $response = $this->actingAs($this->superadmin)
            ->deleteJson("/api/users/{$target->id}");

        $response->assertNoContent();

        $this->assertModelMissing($target);
    }
    
    public function test_superadmin_cannot_delete_self()
    {
        $response = $this->actingAs($this->superadmin)
            ->deleteJson("/api/users/{$this->superadmin->id}");

         $response->assertForbidden();

        $this->assertModelExists($this->superadmin);
    }

    public function test_admin_cannot_delete_user()
    {
        $target = User::factory()->create();

        $response = $this->actingAs($this->admin)
            ->deleteJson("/api/users/{$target->id}");

        $response->assertForbidden();

        $this->assertModelExists($target);
    }
    
    public function test_user_cannot_delete_themselves_even_with_permission()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('users.delete');

        $response = $this->actingAs($user)
            ->deleteJson("/api/users/{$user->id}");

        $response->assertForbidden();

        $this->assertModelExists($user);
    }
    
    public function test_editor_cannot_delete_other_user()
    {
        $target = User::factory()->create();

        $response = $this->actingAs($this->editor)
            ->deleteJson("/api/users/{$target->id}");

        $response->assertForbidden();

        $this->assertModelExists($target);
    }
    
    // LOGIN TESTS
    public function test_user_can_login_successfully()
    {
        $password = 'password';

        $user = User::factory()->create([
            'password' => bcrypt($password),
        ]);

        $response = $this->postJson('/api/users/login', [
            'email' => $user->email,
            'password' => $password,
        ]);

        $response->assertOk()
            ->assertJsonStructure([
                'user',
            ]);

        $this->assertAuthenticatedAs($user);
    }

    public function test_user_cannot_login_with_invalid_credentials()
    {
        $user = User::factory()->create([
            'password' => bcrypt('correct-password'),
        ]);

        $response = $this->postJson('/api/users/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $response->assertUnauthorized()
            ->assertJson([
                'message' => 'Invalid credentials',
            ]);

        $this->assertGuest();
    }
    
    public function test_session_regenerates_on_login()
    {
        $password = 'password';

        $user = User::factory()->create([
            'password' => bcrypt($password),
        ]);

        $this->withSession(['foo' => 'bar']);

        $oldSessionId = session()->getId();

        $this->postJson('/api/users/login', [
            'email' => $user->email,
            'password' => $password,
        ]);

        $this->assertAuthenticated();

        $this->assertNotEquals($oldSessionId, session()->getId());
    }
}
