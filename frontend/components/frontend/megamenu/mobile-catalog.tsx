'use client';

import { useCategories } from "@/hooks/use-categories";
import { useState } from "react";
import { Category } from "@/types/category";
import { MobileCategoryGrid } from "./mobile-category-grid";
import { MobileSubcategoryGrid } from "./mobile-subcategory-grid";

export function MobileCatalog() {
    const { data: categories, isLoading } = useCategories();
    const [selectedRoot, setSelectedRoot] = useState<Category | null>(null);
    const maincategories = categories?.filter((c) => c.parent_id === null);

    if (isLoading) {
        return <div className="p-4">Loading...</div>;
    }
    
    console.log(categories);
    
    if (!selectedRoot) {
        return (
            <MobileCategoryGrid
                categories={maincategories ?? []}
                onSelect={setSelectedRoot}
            />
        );
    }

    return (
        <MobileSubcategoryGrid
            root={selectedRoot}
            categories={categories ?? []}
            onBack={() => setSelectedRoot(null)}
        />
    );
}
