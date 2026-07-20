import { api } from "@/lib/axios";
import { Category } from "@/types/category";

export type GetCategorySectionParams = {
    locale?: string;
    currency?: string;
}

export async function getCategories(): Promise<Category[]> {
    const response = await api.get(
        "/api/store/categories"
    );

    return response.data.data;
}

export async function getCategorySection(params?: GetCategorySectionParams): Promise<Category[]> {
    const response = await api.get(
        "/api/store/category-section",
        { params }
    );

    return response.data.data;
}
