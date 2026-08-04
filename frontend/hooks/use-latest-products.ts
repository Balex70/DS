"use client";

import { useQuery } from "@tanstack/react-query";
import { getLatestProducts } from "@/services/product-service";

export function useLatestProducts(params: {
    locale: string;
    currency?: string
}) {
    return useQuery({
        queryKey: ["latest-products", params],
        queryFn: () =>
            getLatestProducts({
                ...params
            }),
    });
}
