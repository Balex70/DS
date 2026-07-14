import { getProductsFilters } from "@/services/product-service";
import { useQuery } from "@tanstack/react-query";

export function useProductFilters(params: { category: string[], locale: string }) {
    return useQuery({
        queryKey: ['product-filters', params],
        queryFn: () =>
            getProductsFilters({
                ...params
            }),
    });
}
