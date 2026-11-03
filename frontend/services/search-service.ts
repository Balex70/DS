import { api } from "@/lib/axios";
import { Category } from "@/types/category";
import { CurrencyCode } from "@/types/currency";
import { MaterialOption } from "@/types/material";
import { Meta, Product } from "@/types/product";

export type SearchResult = {
    products: Product[];
    categories: Category[];
}

export type GetFullSearchProductsParams = {
    q: string;
    locale: string,
    currency?: CurrencyCode,
    page?: number;
    sort?: string;
    price?: [number, number];
    activeMaterials?: number[];
}

type PaginatedFullSearchResponse<T, M> = {
    products: {
        data: T[];
        meta: Meta;
    },
    categories: M[]
}

export type GetSearchFiltersParams = {
    q?: string;
    locale?: string;
}

type SearchFilterResponse = {
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

export async function search(
    query: string,
    locale: string,
    currency?: CurrencyCode,
): Promise<SearchResult> {
    const queryParams = new URLSearchParams()
    queryParams.append("q", query)
    queryParams.append("locale", locale)
    if (currency) queryParams.append("currency", String(currency))

    const response = await api.get(`/api/store/search?${queryParams.toString()}`);

    return response.data;
}

export async function fullSearch(
    params: GetFullSearchProductsParams
): Promise<PaginatedFullSearchResponse<Product, Category>> {
    const response = await api.get("/api/store/full-search", {
        params,
    });

    return response.data;
}

export async function getSearchFilters(
    params?: GetSearchFiltersParams
): Promise<SearchFilterResponse> {
    const response = await api.get("/api/store/full-search/filters", {
        params,
    });

    return response.data;
}
