"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategorySection } from "@/services/category-service";

export function useCategorySection() {
    return useQuery({
        queryKey: ["category-section"],
        queryFn: getCategorySection,
    });
}
