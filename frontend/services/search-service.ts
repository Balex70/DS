import { api } from "@/lib/axios";
import { Category } from "@/types/category";
import { Meta, Product } from "@/types/product";

export type SearchResult = {
    products: Product[];
    categories: Category[];
}

export type GetSearchProductsParams = {
    q: string;
    page?: number;
    sort?: string;
}

type PaginatedFullSearchResponse<T> = {
    data: T[];
    meta: Meta;
}

export async function search(
    query: string
): Promise<SearchResult> {
    const response = await api.get("/api/store/search", {
        params: {
            q: query,
        },
    });

    return response.data;
}

export async function fullSearch(
    params: GetSearchProductsParams
): Promise<PaginatedFullSearchResponse<Product>> {
    const response = await api.get("/api/store/full-search", {
        params,
    });

    return response.data;
}
