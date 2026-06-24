"use client";

import { useQuery } from "@tanstack/react-query";
import { search } from "@/services/search-service";

export function useSearch(query: string) {
    return useQuery({
        queryKey: ["search", query],
        queryFn: () => search(query),

        enabled: query.length >= 2,
    });
}
