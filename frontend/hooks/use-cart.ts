"use client";

import { useQuery } from "@tanstack/react-query";
import { CartItemPayload } from "@/types/cart";
import { getCart } from "@/services/cart-service";

export type Cart = {
    items: CartItemPayload[];
};

export function useCart(params: { locale: string, currency?: string }) {
    return useQuery<Cart>({
        queryKey: ["cart", params],
        queryFn: async () => {
            const response = await getCart(params);

            return response.data;
        },
    });
}
