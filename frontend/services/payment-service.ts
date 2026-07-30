import { api } from "@/lib/axios";

type createPaymentProps = {
    orderId: number;
    payment_method: string;
    locale?: string;
}
export async function createPayment(props: createPaymentProps) {
    const res = await api.post(`/api/store/payments/${props.orderId}/create`, {
        payment_method: props.payment_method,
        locale: props.locale
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
