

import { api } from "@/lib/axios";
import { CartItemPayload } from "@/types/cart";

export async function addToCart(data: CartItemPayload) {
    return api.post("/api/store/cart/add", data);
}
