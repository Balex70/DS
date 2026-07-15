import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/services/product-service";
import { AxiosError } from "axios";
import { Product } from "@/types/product";

export function useProduct(id: string | number, currency?: string) {
    return useQuery<Product, AxiosError>({
        queryKey: ["product", id, currency],
        queryFn: () => getProduct(id, currency),
        enabled: !!id,
    });
}
