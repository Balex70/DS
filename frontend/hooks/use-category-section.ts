"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategorySection } from "@/services/category-service";

export function useCategorySection(params: { locale?: string, currency?: string }) {
    return useQuery({
        queryKey: ["category-section", params],
        queryFn: () => getCategorySection({
            ...params,
        }),
    });
}
