import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "@/services/order-service";
import { Order, OrderPayload } from "@/types/order";
import { AxiosError } from "axios";

type ValidationErrorResponse = {
    errors: Record<string, string[]>;
};

export function useCreateOrder() {
    const queryClient = useQueryClient();

    return useMutation<Order, AxiosError<ValidationErrorResponse>, OrderPayload>({
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
