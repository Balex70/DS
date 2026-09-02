import { removeFromCart } from "@/services/cart-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useRemoveFromCart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (productId: number) => {
            const res = await removeFromCart({ product_id: productId });

            return res.data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["cart"],
            });
        },
    });
}
