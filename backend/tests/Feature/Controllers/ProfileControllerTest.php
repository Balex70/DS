<?php

namespace Tests\Feature\Controllers;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfileControllerTest extends TestCase
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
    
    public function test_user_can_update_own_profile()
    {
        $response = $this->actingAs($this->editor)
            ->putJson('/api/users/me', [
                'name' => 'Updated Name',
                'email' => $this->editor->email,
            ]);

        $response->assertOk();

        $this->editor->refresh();

        $this->assertEquals(
            'Updated Name',
            $this->editor->name
        );
    }

    public function test_user_cannot_change_role_via_profile_update()
    {
        $response = $this->actingAs($this->editor)
            ->putJson('/api/users/me', [
                'name' => 'Updated Name',
                'email' => $this->editor->email,
                'role' => 'superadmin',
            ]);

        $response->assertUnprocessable();

        $this->editor->refresh();

        $this->assertTrue(
            $this->editor->hasRole('editor')
        );
    }
}
