"use client";

import { ProductsSection } from "@/components/frontend/category/products-section";
import { CategorySidebar } from "@/components/frontend/category/CategorySidebar";
import { useProducts } from "@/hooks/use-products";
import { useState } from "react";
import { useProductFilters } from "@/hooks/use-product-filters";
import { SortSelect } from "./SortSelect";
import { useCurrency } from "@/context/CurrencyContext";
import { MobileSortSelect } from "./MobileSortSelect";
import { SortSelectValue } from "@/types/category";
import { MobileCategorySidebar } from "./MobileCategorySidebar";

type Props = {
    slug: string[];
    locale: string;
};

export function CategoryComponent({
    slug,
    locale
}: Props) {
    const { currency } = useCurrency();
    const { data: filterData, isLoading: isFilterLoading } = useProductFilters({category: slug, locale: locale});
    const [sort, setSort] = useState<SortSelectValue>("latest");
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

    // Check if category has products based on price range
    let hasProducts = true;
    if (minPrice === 0 && maxPrice === 10000) {
        hasProducts = false;
    }

    return (
        <div className="flex w-full gap-6">
            <aside className="hidden w-72 shrink-0 lg:block">
                {!isFilterLoading &&
                    <CategorySidebar
                        hasProducts={hasProducts}
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
                <div className="space-y-3 lg:space-y-6">
                    <div className="px-2 mb-2">
                        {/* Desktop */}
                        <div className="hidden lg:block">
                            <SortSelect hasProducts={hasProducts} value={sort} onChange={setSort} />
                        </div>

                        {/* Mobile */}
                        <div className="flex items-center justify-between lg:hidden">
                            <MobileCategorySidebar
                                hasProducts={hasProducts}
                                isLoading={false}
                                minPrice={minPrice}
                                maxPrice={maxPrice}
                                price={priceDraft}
                                activeMaterials={activeMaterials}
                                materialsOptions={filterData?.materials ?? []}
                                onPriceChange={setPriceDraft}
                                setPriceApplied={() => setPrice(priceDraft)}
                                setActiveMaterials={setActiveMaterials}
                            />

                            <MobileSortSelect
                                hasProducts={hasProducts}
                                value={sort}
                                onChange={setSort}
                            />
                        </div>
                    </div>
                    {/* Products */}
                    <ProductsSection
                        hasProducts={hasProducts}
                        data={productsQuery.data}
                        isLoading={productsQuery.isLoading}
                        fetchNextPage={productsQuery.fetchNextPage}
                        hasNextPage={productsQuery.hasNextPage}
                        isFetchingNextPage={productsQuery.isFetchingNextPage}
                    />
                </div>
            </main>
        </div>
    );
}
