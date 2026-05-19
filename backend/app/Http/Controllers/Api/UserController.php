<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginUserRequest;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Gate::authorize('viewAny', User::class);
        return UserResource::collection(User::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        Gate::authorize('create', User::class);

        $user = User::create($request->validated());

        $user->assignRole($request->role);

        return new UserResource($user);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        Gate::authorize('view', $user);
        return new UserResource($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        Gate::authorize('update', $user);

        $user->update($request->validated());

        $user->syncRoles([$request->role]);

        return new UserResource($user);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        Gate::authorize('delete', $user);

        $user->delete();

        return response()->noContent();
    }

    public function login(LoginUserRequest $request) {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $request->session()->regenerate();

        return response()->json([
            'user' => $request->user(),
        ]);
    }

    public function loginWithToken(LoginUserRequest $request) {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = $request->user();
        $token = $user->createToken('api-token');

        return ['token' => $token->plainTextToken];
    }

    public function meWithToken(Request $request) {
        return new UserResource($request->user());
    }
}
