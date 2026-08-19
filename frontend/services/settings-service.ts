import { api } from "@/lib/axios";

export async function getSettings() {
    return api.get("/api/store/settings");
}
