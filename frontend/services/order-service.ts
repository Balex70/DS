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
