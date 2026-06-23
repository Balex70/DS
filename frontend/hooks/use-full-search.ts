"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { fullSearch } from "@/services/search-service";

export function useFullSearch(params: { q: string; sort: string }) {
    return useInfiniteQuery({
        queryKey: ["search", params],
        queryFn: ({ pageParam = 1 }) =>
            fullSearch({
                ...params,
                page: pageParam,
            }),
        getNextPageParam: (lastPage) => {
            return lastPage.meta.current_page < lastPage.meta.last_page
                ? lastPage.meta.current_page + 1
                : undefined;
        },
        initialPageParam: 1,
        enabled: params.q.length >= 2,
    });
}
