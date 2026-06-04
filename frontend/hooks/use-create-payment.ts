import { useMutation } from "@tanstack/react-query";
import { createPayment } from "@/services/payment-service";

export function useCreatePayment() {
    return useMutation({
        mutationFn: async (data: { orderId: number; payment_method: string }) => {
            const response = await createPayment(data.orderId, data.payment_method);

            return response;
        },
    });
}
