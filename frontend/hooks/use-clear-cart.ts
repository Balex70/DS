import { clearCart } from "@/services/cart-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useClearCart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const response = await clearCart();
            return response.data;
        },

        onSuccess: () => {
            // instantly reset cache
            queryClient.invalidateQueries({
                queryKey: ["cart"],
            });
        },
    });
}
