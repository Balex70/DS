import { api } from "@/lib/axios";

export async function createPayment(orderId: number, payment_method: string) {
    const res = await api.post(`/api/store/payments/${orderId}/create`, {
        payment_method,
    });

    return res.data;
}

export async function getAvailableGateway(data: {
    country: string;
    currency: string;
}) {
    const res = await api.post(
        "/api/store/payments/available-gateway",
        data
    );

    return res.data;
}
