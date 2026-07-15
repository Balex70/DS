"use client";

import { Separator } from "@/components/ui/separator";
import { SubcategoriesSection } from "@/components/frontend/category/subcategories-section";
import { CategoryHeaderSection } from "@/components/frontend/category/category-header-section";
import { ProductsSection } from "@/components/frontend/category/products-section";
import { CategorySidebar } from "@/components/frontend/category/CategorySidebar";
import { useProducts } from "@/hooks/use-products";
import { useState } from "react";
import { useProductFilters } from "@/hooks/use-product-filters";
import { SortSelect } from "./SortSelect";
import { useLocale } from 'next-intl';
import { CategoryFooterSection } from "./category-footer-section";
import { useCurrency } from "@/context/CurrencyContext";

type Props = {
    slug: string[];
};

export function CategoryComponent({ slug }: Props) {
    const locale = useLocale();
    const { currency } = useCurrency();
    const { data: filterData, isLoading: isFilterLoading } = useProductFilters({category: slug, locale: locale});
    const [sort, setSort] = useState<"latest" | "price_asc" | "price_desc">("latest"); // TODO: use type here
    const [priceDraft, setPriceDraft] = useState<[number, number]>([0, 10000]);
    const [price, setPrice] = useState<[number, number]>([0, 10000]);
    const [activeMaterials, setActiveMaterials] = useState<number[]>([]);

    if (!isFilterLoading && filterData && price[0] === 0 && price[1] === 10000) {
        const range: [number, number] = [
            filterData.price.min,
            filterData.price.max,
        ];

        setPriceDraft(range);
        setPrice(range);
    }

    const minPrice = filterData?.price.min ?? 0;
    const maxPrice = filterData?.price.max ?? 10000;

    const productsQuery = useProducts({
        category: slug,
        locale,
        sort,
        price,
        activeMaterials,
        currency
    });

    return (
        <>
            <aside className="hidden w-72 shrink-0 lg:block">
                {!isFilterLoading &&
                    <CategorySidebar
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        price={priceDraft}
                        activeMaterials={activeMaterials}
                        materialsOptions={filterData?.materials ?? []}
                        onPriceChange={setPriceDraft}
                        setPriceApplied={() => setPrice(priceDraft)}
                        setActiveMaterials={setActiveMaterials}
                    />
                }
            </aside>

            <main className="min-w-0 flex-1">
                <div className="space-y-6">
                    {/* Header / Category Info */}
                    <CategoryHeaderSection slug={slug} />

                    {/* Subcategories */}
                    <SubcategoriesSection slug={slug} />

                    <Separator />

                    <div className="px-2 mb-2">
                        <SortSelect value={sort} onChange={setSort} />
                    </div>
                    {/* Products */}
                    <ProductsSection
                        data={productsQuery.data}
                        isLoading={productsQuery.isLoading}
                        fetchNextPage={productsQuery.fetchNextPage}
                        hasNextPage={productsQuery.hasNextPage}
                        isFetchingNextPage={productsQuery.isFetchingNextPage}
                    />

                    {/* Footer / Category description */}
                    <CategoryFooterSection slug={slug} />
                </div>
            </main>
        </>
    );
}
