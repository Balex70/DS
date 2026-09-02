<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginCustomerRequest;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Http\Resources\CustomerResource;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Socialite;
use Illuminate\Support\Str;

class CustomerController extends Controller
{
    public function register(StoreCustomerRequest $request)
    {
        $data = $request->validated();

        $customer = Customer::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        Auth::guard('customers')->login($customer);

        return new CustomerResource($customer);
    }
    
    public function login(LoginCustomerRequest $request)
    {
        $data = $request->validated();

        if (!Auth::guard('customers')->attempt([
            'email' => $data['email'],
            'password' => $data['password'],
        ])) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        $customer = Auth::guard('customers')->user();

        $request->session()->regenerate();

        return new CustomerResource($customer);
    }

    public function logout(Request $request)
    {
        Auth::guard('customers')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logged out'
        ]);
    }
    
    public function me(Request $request)
    {
        $customer = Auth::guard('customers')->user();
        return new CustomerResource($customer);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCustomerRequest $request, Customer $customer)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer)
    {
        //
    }

    public function googleRedirect()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function googleCallback(Request $request)
    {
        $googleUser = Socialite::driver('google')
            ->stateless()
            ->user();

        $customer = Customer::firstOrCreate(
            [
                'email' => $googleUser->getEmail(),
            ],
            [
                'name' => $googleUser->getName(),
                'google_id' => $googleUser->getId(),
                'avatar' => $googleUser->getAvatar(),
                'password' => bcrypt(Str::random(32)),
            ]
        );

        if (!$customer->google_id) {
            $customer->update([
                'google_id' => $googleUser->getId(),
            ]);
        }

        Auth::guard('customers')->login($customer);

        $request->session()->regenerate();

        return redirect(env('APP_URL'));
    }
}
