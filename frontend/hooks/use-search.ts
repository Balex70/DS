"use client";

import { useQuery } from "@tanstack/react-query";
import { search } from "@/services/search-service";
import { CurrencyCode } from "@/types/currency";

export function useSearch(query: string, locale: string, currency?: CurrencyCode) {
    const normalizedQuery = query.trim();
    return useQuery({
        queryKey: ["search", normalizedQuery, locale, currency],
        queryFn: () => search(normalizedQuery,  locale, currency),

        enabled: normalizedQuery.length >= 2,
    });
}
