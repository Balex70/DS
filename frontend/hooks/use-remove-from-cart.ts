import { removeFromCart } from "@/services/cart-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useRemoveFromCart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (variantId: number) => {
            const res = await removeFromCart({ product_variant_id: variantId });

            return res.data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["cart"],
            });
        },
    });
}
