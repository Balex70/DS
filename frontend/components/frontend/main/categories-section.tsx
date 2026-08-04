"use client";

import { useCurrency } from "@/context/CurrencyContext";
import { CategorySection } from "./category-section";
import { useCategorySection } from "@/hooks/use-category-section";
import { Category } from "@/types/category";
import { useLocale } from "next-intl";

export function CategoriesSection() {
    const locale = useLocale();
    const { currency } = useCurrency();
    const { data: categories, isLoading } = useCategorySection({locale: locale, currency: currency});
    
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
