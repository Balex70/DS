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
import { useLocale, useTranslations } from 'next-intl';
import { CategoryFooterSection } from "./category-footer-section";
import { useCurrency } from "@/context/CurrencyContext";
import { MobileSortSelect } from "./MobileSortSelect";
import { SortSelectValue } from "@/types/category";
import { MobileCategorySidebar } from "./MobileCategorySidebar";
import { useCategories } from "@/hooks/use-categories";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

type Props = {
    slug: string[];
};

export function CategoryComponent({ slug }: Props) {
    const { data: categories, isLoading } = useCategories();
    const locale = useLocale();
    const t = useTranslations('frontend')
    const lastSlug = slug[slug.length - 1];
    const category = categories?.find((c) => c.slug === lastSlug);
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

    if (!isLoading && !category) {
      return (
        <div className="min-w-0 flex-1">
            <Card className="mx-auto w-full max-w-5xl overflow-hidden border-border/60 bg-background shadow-sm">
                <CardContent className="flex min-h-[360px] flex-col items-center justify-center px-6 py-12 text-center">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30">
                        <AlertCircle className="h-10 w-10 text-red-500 dark:text-red-400" />
                    </div>

                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                        {t('category.category_not_found')}
                    </h2>

                    <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                        {t('category.category_not_found_description')}
                    </p>

                    <Button
                        className="mt-6"
                        variant="outline"
                    >
                        <Link href="/">
                            {t('to_home_button')}
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      )
    }

    return (
        <>
            <aside className="hidden w-72 shrink-0 lg:block">
                {!isFilterLoading &&
                    <CategorySidebar
                        data={productsQuery.data}
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
                    {/* Header / Category Info */}
                    <CategoryHeaderSection category={category} isLoading={isLoading} />

                    {/* Subcategories */}
                    <SubcategoriesSection slug={slug} category={category} categories={categories} isLoading={isLoading} />

                    <Separator />

                    <div className="px-2 mb-2">
                        {/* Desktop */}
                        <div className="hidden lg:block">
                            <SortSelect value={sort} onChange={setSort} />
                        </div>

                        {/* Mobile */}
                        <div className="flex items-center justify-between lg:hidden">
                            <MobileCategorySidebar
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
                                value={sort}
                                onChange={setSort}
                            />
                        </div>
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
                    <CategoryFooterSection category={category} isLoading={isLoading} />
                </div>
            </main>
        </>
    );
}
