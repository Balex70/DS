import { updateCartItem } from "@/services/cart-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateCartItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            variantId,
            quantity,
        }: {
            variantId: number;
            quantity: number;
        }) => {
            const res = await updateCartItem({
                product_variant_id: variantId,
                quantity,
            });

            return res.data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["cart"],
            });
        },
    });
}
