"use client";

import { useQuery } from "@tanstack/react-query";
import { search } from "@/services/search-service";
import { CurrencyCode } from "@/types/currency";

export function useSearch(query: string, currency?: CurrencyCode) {
    return useQuery({
        queryKey: ["search", query, currency],
        queryFn: () => search(query, currency),

        enabled: query.length >= 2,
    });
}
