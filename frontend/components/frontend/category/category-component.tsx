"use client";

import { Separator } from "@/components/ui/separator";
import { SubcategoriesSection } from "@/components/frontend/category/subcategories-section";
import { CategoryHeaderSection } from "@/components/frontend/category/category-header-section";
import { ProductsSection } from "@/components/frontend/category/products-section";
import { CategorySidebar } from "@/components/frontend/category/CategorySidebar";
import { useProducts } from "@/hooks/use-products";
import { useState } from "react";
import { useProductFilters } from "@/hooks/use-product-filters";

type Props = {
    slug: string[];
};

export function CategoryComponent({ slug }: Props) {
    const { data: filterData, isLoading: isFilterLoading } = useProductFilters({category: slug});
    const [priceDraft, setPriceDraft] = useState<[number, number]>([
        filterData?.price.min ?? 0,
        filterData?.price.max ?? 10000,
    ]);
    const [price, setPrice] = useState<[number, number]>([
        filterData?.price.min ?? 0,
        filterData?.price.max ?? 10000,
    ]);

    const productsQuery = useProducts({
        category: slug,
        sort: "latest",
        price,
    });

    return (
        <>
            <aside className="hidden w-72 shrink-0 lg:block">
                <CategorySidebar
                    price={priceDraft}
                    onPriceChange={setPriceDraft}
                    setPriceApplied={() => setPrice(priceDraft)}
                />
            </aside>

            <main className="min-w-0 flex-1">
                <div className="space-y-6">
                    {/* Header / Category Info */}
                    <CategoryHeaderSection slug={slug} />

                    {/* Subcategories */}
                    <SubcategoriesSection slug={slug} />

                    <Separator />

                    {/* Products */}
                    <ProductsSection
                        data={productsQuery.data}
                        isLoading={productsQuery.isLoading}
                        fetchNextPage={productsQuery.fetchNextPage}
                        hasNextPage={productsQuery.hasNextPage}
                        isFetchingNextPage={productsQuery.isFetchingNextPage}
                    />

                </div>
            </main>
        </>
    );
}
