import { api } from "@/lib/axios";
import { Category } from "@/types/category";
import { Product } from "@/types/product";

export interface SearchResult {
    products: Product[];
    categories: Category[];
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
