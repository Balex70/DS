import { api } from "@/lib/axios";
import { Meta, Product } from "@/types/product";

export interface GetProductsParams {
    category?: string[];
    page?: number;
    sort?: string;
}

interface PaginatedResponse<T> {
    data: T[];
    meta: Meta;
}

export async function getProducts(
    params?: GetProductsParams
): Promise<PaginatedResponse<Product>> {
    const response = await api.get("/api/store/products", {
        params,
    });

    return response.data;
}

export async function getProduct(id: string | number): Promise<Product> {
    const response = await api.get(`/api/store/products/${id}`);
    return response.data.data;
}
