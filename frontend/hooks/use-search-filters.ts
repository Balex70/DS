import { getSearchFilters } from "@/services/search-service";
import { useQuery } from "@tanstack/react-query";

export function useSearchFilters(params: { q: string, locale: string }) {
    return useQuery({
        queryKey: ['search-filters', params],
        queryFn: () =>
            getSearchFilters({
                ...params
            }),
    });
}
