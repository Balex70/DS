"use client";

import { useQuery } from "@tanstack/react-query";
import { fullSearch } from "@/services/search-service";

export function useFullSearch(query: string) {
    return useQuery({
        queryKey: ["search", query],
        queryFn: () => fullSearch(query),

        enabled: query.length >= 2,
    });
}
