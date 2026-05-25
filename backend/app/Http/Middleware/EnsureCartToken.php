<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class EnsureCartToken
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->cookie('cart_token');

        if (!$token) {
            $token = Str::random(32);
        }

        // Inject into request so controllers can use it immediately
        $request->attributes->set('cart_token', $token);

        $response = $next($request);

        // set cookie AFTER response
        return $response->cookie(
            'cart_token',
            $token,
            60 * 24 * 30
        );
    }
}
