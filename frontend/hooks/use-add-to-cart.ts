import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart } from "@/services/cart-service";
import { CartItemPayload } from "@/types/cart";

export function useAddToCart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CartItemPayload) => addToCart(data),

        onSuccess: () => {
            // optional: refresh cart UI if you have cart query
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
    });
}
