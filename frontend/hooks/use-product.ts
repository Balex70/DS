import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/services/product-service";
import { AxiosError } from "axios";
import { Product } from "@/types/product";

export function useProduct(id: string | number) {
    return useQuery<Product, AxiosError>({
        queryKey: ["product", id],
        queryFn: () => getProduct(id),
        enabled: !!id,
    });
}
