import { apiFetch } from "./client";

export function cancelOrder(id: number) {
    return apiFetch(`/api/orders/${id}/cancel`, {
        method: "POST",
    });
}
