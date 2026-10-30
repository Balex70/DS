"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { fullSearch } from "@/services/search-service";
import { CurrencyCode } from "@/types/currency";
import { Meta, Product } from "@/types/product";
import { Category } from "@/types/category";

type PaginatedFullSearchResponse<T, M> = {
    products: {
        data: T[];
        meta: Meta;
    },
    categories: M[]
}

export function useFullSearch(params: { q: string; locale: string, currency?: CurrencyCode }) {
    return useInfiniteQuery<PaginatedFullSearchResponse<Product, Category>>({
        queryKey: ["search", params],
        queryFn: ({ pageParam = 1 }) =>
            fullSearch({
                ...params,
                page: pageParam as number,
            }),
        getNextPageParam: (lastPage) => {
            const { current_page, last_page } = lastPage.products.meta;
            return current_page < last_page
                ? current_page + 1
                : undefined;
        },
        initialPageParam: 1,
        enabled: params.q.length >= 2,
    });
}
