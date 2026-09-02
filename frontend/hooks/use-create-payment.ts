import { useMutation } from "@tanstack/react-query";
import { createPayment } from "@/services/payment-service";

type Props = {
    orderId: number;
    payment_method: string;
    locale?: string;
}
export function useCreatePayment() {
    return useMutation({
        mutationFn: async (data: Props) => {
            const response = await createPayment({
                orderId: data.orderId,
                payment_method: data.payment_method,
                locale: data.locale ? data.locale : "en"
            });

            return response;
        },
    });
}
