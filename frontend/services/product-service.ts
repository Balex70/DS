import { api } from "@/lib/axios";
import { MaterialOption } from "@/types/material";
import { Meta, Product } from "@/types/product";

export type GetProductsParams = {
    category?: string[];
    locale: string;
    page?: number;
    sort?: string;
    price?: [number, number];
    activeMaterials?: number[];
}

export type GetProductsFiltersParams = {
    category?: string[];
    locale?: string;
}

type PaginatedResponse<T> = {
    data: T[];
    meta: Meta;
}

type PaginatedFilterResponse = {
    price: {
        min: number;
        max: number;
    };
    materials: MaterialOption[];
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
