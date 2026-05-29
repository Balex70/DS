import { api } from "@/lib/axios";
import { OrderPayload } from "@/types/order";

export async function createOrder(data: OrderPayload) {
    return api.post("/api/store/orders/create", {
        ...data,
        payment_method: "stripe",
        shipping_cost: 0,
        currency: "USD",
    });
}

type ShippingCalculatePayload = {
    shipping_country: string;
    shipping_postal_code?: string;
};

export async function getShippingCalculate(
    data: ShippingCalculatePayload
): Promise<any> {
    const response = await api.post(
        "/api/store/orders/shipping-calculate",
        data
    );

    return response.data;
}
