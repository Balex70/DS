import { api } from "@/lib/axios";

export async function createPayment(orderId: number, payment_method: string) {
    const res = await api.post(`/api/store/payments/${orderId}/create`, {
        payment_method,
    });

    return res.data;
}
