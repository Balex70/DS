import { api } from "@/lib/axios";
import { Order, OrderPayload } from "@/types/order";
import { ShippingMethod } from "@/types/shipping";
import { AxiosResponse } from "axios";

export async function createOrder(data: OrderPayload): Promise<AxiosResponse<Order>> {
    return api.post("/api/store/orders/create", data);
}

type ShippingCalculatePayload = {
    shipping_country: string;
    shipping_postal_code?: string;
};

export async function getShippingCalculate(
    data: ShippingCalculatePayload
): Promise<ShippingMethod[]> {
    const response = await api.post(
        "/api/store/orders/shipping-calculate",
        data
    );

    return response.data;
}
