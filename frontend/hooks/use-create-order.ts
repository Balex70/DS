import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "@/services/order-service";
import { OrderPayload } from "@/types/order";

export function useCreateOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: OrderPayload) => {
            const response = await createOrder(data);

            return response.data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["cart"],
            });

            queryClient.invalidateQueries({
                queryKey: ["orders"],
            });
        },
    });
}
