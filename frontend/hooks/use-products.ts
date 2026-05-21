"use client";

import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/services/product-service";
export function useProducts(params: {
    category?: string;
    page?: number;
    sort?: string;
}) {
    return useQuery({
        queryKey: ['products', params],
        queryFn: () => getProducts(params),
    });
}
