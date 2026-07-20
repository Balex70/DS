import { api } from "@/lib/axios";
import { Category } from "@/types/category";

export async function getCategories(): Promise<Category[]> {
    const response = await api.get(
        "/api/store/categories"
    );

    return response.data.data;
}

export async function getCategorySection(): Promise<Category[]> {
    const response = await api.get(
        "/api/store/category-section"
    );

    return response.data.data;
}
