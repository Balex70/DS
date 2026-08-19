"use client";

import { useQuery } from "@tanstack/react-query";
import { Settings } from "@/types/settings";
import { getSettings } from "@/services/settings-service";

export function useSettings() {
    return useQuery<Settings>({
        queryKey: ["settings"],
        queryFn: async () => {
            const response = await getSettings();

            return response.data;
        },
    });
}
