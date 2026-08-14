'use client';

import { useCategories } from "@/hooks/use-categories";
import { useState } from "react";
import { Category } from "@/types/category";
import { MobileCategoryGrid } from "./mobile-category-grid";
import { MobileSubcategoryGrid } from "./mobile-subcategory-grid";
import { useTranslations } from "next-intl";
import SimpleSkeletonLoader from "@/components/common/SimpleSkeletonLoader";

export function MobileCatalog({onClose}: {onClose: () => void}) {
    const { data: categories, isLoading } = useCategories();
    const [selectedRoot, setSelectedRoot] = useState<Category | null>(null);
    const maincategories = categories?.filter((c) => c.parent_id === null);
    const t = useTranslations('frontend')

    if (isLoading) {
        return <SimpleSkeletonLoader label={t('loading_loader')} className="p-4" />;
    }
    
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
            onClose={onClose}
        />
    );
}
