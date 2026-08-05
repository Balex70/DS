import { apiFetch } from "./client";

export function sendOrder(id: number) {
    return apiFetch(`/api/orders/${id}/send`, {
        method: "POST",
    });
}

export function checkOrderDsStatus(id: number) {
    return apiFetch(`/api/orders/${id}/check-ds-status`, {
        method: "POST",
    });
}

export function cancelOrder(id: number) {
    return apiFetch(`/api/orders/${id}/cancel`, {
        method: "POST",
    });
}

export function simulatePayOrder(id: number) {
    return apiFetch(`/api/orders/${id}/simulate-pay`, {
        method: "POST",
    });
}
