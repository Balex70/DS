import { apiFetch } from "./client";

export function getSettings() {
    return apiFetch(`/api/settings`, {
        method: "GET",
    });
}

export function getCurrencies() {
    return apiFetch(`/api/currencies`, {
        method: "GET",
    });
}
