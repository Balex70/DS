import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart } from "@/services/cart-service";
import { CartItemPayload } from "@/types/cart";

export function useAddToCart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CartItemPayload) => {
            const response = await addToCart(data);

            return response.data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["cart"],
            });
        },
    });
}
