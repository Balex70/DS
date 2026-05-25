"use client";

import { useQuery } from "@tanstack/react-query";
import { CartItemPayload } from "@/types/cart";
import { getCart } from "@/services/cart-service";

export type Cart = {
    items: CartItemPayload[];
};

export function useCart() {
    return useQuery<Cart>({
        queryKey: ["cart"],
        queryFn: async () => {
            const response = await getCart();

            return response.data;
        },
    });
}
