import { api } from "@/lib/axios";
import { Order, OrderPayload, TrackingInfo } from "@/types/order";
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
    data: ShippingCalculatePayload,
    currency?: string
): Promise<ShippingMethod[]> {
    const response = await api.post(
        "/api/store/orders/shipping-calculate",
        {
            ...data,
            currency,
        }
    );

    return response.data;
}

export async function getOrderByPublicToken(token: string): Promise<Order> {
    const response = await api.get(
        `/api/store/orders/public-token/${token}`
    );

    return response.data;
}

export async function getOrderTrackInfo(trackNumber: string): Promise<TrackingInfo> {
    const response = await api.get(
        `/api/store/orders/track-info/${trackNumber}`
    );

    return response.data.data;
}
