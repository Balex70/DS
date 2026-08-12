import { apiFetch } from "./client";

export function getSettings() {
    return apiFetch(`/api/settings`, {
        method: "GET",
    });
}
