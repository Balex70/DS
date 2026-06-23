import { api } from "@/lib/axios";
import { Category } from "@/types/category";
import { Meta, Product } from "@/types/product";

export interface SearchResult {
    products: Product[];
    categories: Category[];
}

interface PaginatedFullSearchResponse<T> {
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
    query: string
): Promise<PaginatedFullSearchResponse<Product>> {
    const response = await api.get("/api/store/full-search", {
        params: {
            q: query,
        },
    });

    return response.data;
}
