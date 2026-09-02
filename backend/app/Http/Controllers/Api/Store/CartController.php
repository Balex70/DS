<?php
namespace App\Http\Controllers\Api\Store;

use App\Currency\Services\PriceConverter;
use App\Enums\CurrenciesEnum;
use App\Enums\LocalesEnum;
use App\Http\Controllers\Controller;
use App\Models\ProductVariant;
use App\Services\CartService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;

class CartController extends Controller
{
    public function __construct(
        private PriceConverter $converter
    ) {}

    public function show(Request $request, CartService $cartService)
    {
        $token = $request->attributes->get('cart_token');

        if (!$token) {
            return response()->json(['items' => []]);
        }

        $cartEntity = $cartService->get($token);
        $hydratedItems = [];

        foreach ($cartEntity['items'] as $cartItem) {
            if($request->filled('locale') && LocalesEnum::tryFrom($request->locale)) {
                $locale = $request->locale ?? 'en';
                $productVariant = ProductVariant::with([
                    'translation' => fn ($q) => $q->where('locale', $locale),
                ])->find($cartItem['product_id']);
            }

            $hydratedItem = [
                ...$cartItem,
                'title' => $productVariant?->translation?->name ?? $productVariant?->name ?? $cartItem['title'],
            ];

            if($request->filled('currency') && $request->currency !== CurrenciesEnum::USD->value) {
                $currencyPrice = $this->converter->convert(
                        $cartItem['price'],
                        CurrenciesEnum::USD->value,
                        $request->currency, //
                    );
                $hydratedItem['currency_price'] = $currencyPrice;
            }

            $hydratedItems[] = $hydratedItem;
        }

        return response()->json([
            'items' => $hydratedItems
        ]);
    }

    public function add(Request $request, CartService $cartService)
    {
        $token = $cartService->getOrCreateToken(
            $request->attributes->get('cart_token')
        );

        $item = $request->validate([
            'product_id' => ['nullable', 'integer'],
            'vid' => ['required', 'string'],
            'title' => ['required', 'string'],
            'sku' => ['required', 'string'],
            'quantity' => ['required', 'integer', 'min:1'],
            'price' => ['required', 'numeric', 'min:0'],
            'image' => ['nullable', 'string'],
            'product_weight' => ['nullable', 'string', 'min:0'],
            'packing_weight' => ['nullable', 'string', 'min:0'],
        ]);

        $cart = $cartService->addItem($token, $item);

        return response()
            ->json($cart)
            ->cookie('cart_token', $token, 60 * 24 * 30);
    }

    public function update(Request $request, CartService $cartService)
    {
        $token = $request->attributes->get('cart_token');

        $data = $request->validate([
            'product_id' => ['required', 'integer'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $cart = $cartService->updateQuantity(
            $token,
            $data['product_id'],
            $data['quantity']
        );

        return response()->json($cart);
    }

    public function remove(Request $request, CartService $cartService)
    {
        $token = $request->attributes->get('cart_token');

        $request->validate([
            'product_id' => ['required', 'integer'],
        ]);

        if ($token) {
            $cartService->removeItem($token, $request->product_id);
        }

        return response()->json($cartService->get($token));
    }

    public function clear(Request $request, CartService $cartService)
    {
        $token = $request->attributes->get('cart_token');

        if ($token) {
            $cartService->clear($token);
        }

        Cookie::queue(Cookie::forget('cart_token'));

        return response()
            ->json(['message' => 'Cart cleared']);
    }
}
