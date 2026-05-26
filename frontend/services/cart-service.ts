

import { api } from "@/lib/axios";
import { CartItemPayload } from "@/types/cart";

export async function addToCart(data: CartItemPayload) {
    return api.post("/api/store/cart/add", data);
}

export async function getCart() {
    return api.get("/api/store/cart");
}

export async function clearCart() {
    return api.post("/api/store/cart/clear");
}

export async function removeFromCart(data: Pick<CartItemPayload, "product_id">) {
    return api.post("/api/store/cart/remove", data);
}
