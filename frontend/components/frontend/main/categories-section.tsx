"use client";

import { CategorySection } from "./category-section";
import { useCategorySection } from "@/hooks/use-category-section";
import { Category } from "@/types/category";

export function CategoriesSection() {
    const { data: categories, isLoading } = useCategorySection();    
    
    if (!categories?.length) {
        return null;
    }
    
    const filteredCategories = categories.filter((category: Category) => category.products?.length && category.products.length > 0);

    return (
        <div className="mt-12 space-y-16">
            {filteredCategories.map(category => (
                <CategorySection
                    key={category.id}
                    category={category}
                    products={category.products}
                />
            ))}
        </div>
    );
}
