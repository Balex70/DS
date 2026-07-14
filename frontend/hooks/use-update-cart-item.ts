import { updateCartItem } from "@/services/cart-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateCartItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            productId,
            quantity,
        }: {
            productId: string;
            quantity: number;
        }) => {
            const res = await updateCartItem({
                product_id: productId,
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
