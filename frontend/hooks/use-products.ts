"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getProducts } from "@/services/product-service";

export function useProducts(params: {
    category: string[];
    locale: string;
    sort: string;
    price?: [number, number];
    activeMaterials?: number[];
}) {
    return useInfiniteQuery({
        queryKey: ["products", params],
        queryFn: ({ pageParam = 1 }) =>
            getProducts({
                ...params,
                page: pageParam,
            }),
        getNextPageParam: (lastPage) => {
            return lastPage.meta.current_page < lastPage.meta.last_page
                ? lastPage.meta.current_page + 1
                : undefined;
        },
        initialPageParam: 1,
    });
}
