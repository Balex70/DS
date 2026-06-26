import { api } from "@/lib/axios";
import { Meta, Product } from "@/types/product";

export interface GetProductsParams {
    category?: string[];
    page?: number;
    sort?: string;
    price?: [number, number];
    activeMaterials?: string[];
}

export interface GetProductsFiltersParams {
    category?: string[];
}

interface PaginatedResponse<T> {
    data: T[];
    meta: Meta;
}

interface PaginatedFilterResponse {
    price: {
        min: number;
        max: number;
    };
    materials: string[];
    weight: {
        min: number;
        max: number;
    }
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

export async function getProductsFilters(
    params?: GetProductsFiltersParams
): Promise<PaginatedFilterResponse> {
    const response = await api.get("/api/store/products/filters", {
        params,
    });

    return response.data;
}
