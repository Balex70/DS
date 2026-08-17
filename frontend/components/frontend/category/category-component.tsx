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
import { Skeleton } from "@/components/ui/skeleton";

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

    if (isLoading) {
        return (
            <>
                {/* Sidebar */}
                <aside className="hidden w-72 shrink-0 lg:block">
                    <div className="space-y-6">
                        <Skeleton className="h-6 w-32" />
                        <div className="space-y-3">
                            <Skeleton className="h-2 w-full rounded-full" />
                        </div>
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-7 w-full" />
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-7 w-full" />
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-7 w-full" />
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-4 w-28" />
                        </div>
                    </div>
                </aside>

                {/* Main content */}
                <main className="min-w-0 flex-1">
                    <div className="space-y-3 lg:space-y-6">
                        <div className="space-y-3">
                            <Skeleton className="h-9 w-2/3 max-w-md" />
                            <Skeleton className="h-4 w-full max-w-2xl" />
                            <Skeleton className="h-4 w-4/5 max-w-xl" />
                        </div>
                        <div className="py-1">
                            <Skeleton className="h-px w-full" />
                        </div>
                        <div className="space-y-3 pt-4">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-full max-w-3xl" />
                            <Skeleton className="h-4 w-5/6 max-w-2xl" />
                        </div>
                        <div className="flex gap-3 overflow-hidden">
                            <Skeleton className="h-42 w-42 shrink-0 rounded-lg" />
                            <Skeleton className="h-42 w-42 shrink-0 rounded-lg" />
                            <Skeleton className="h-42 w-42 shrink-0 rounded-lg" />
                            <Skeleton className="h-42 w-42 shrink-0 rounded-lg" />
                            <Skeleton className="h-42 w-42 shrink-0 rounded-lg" />
                        </div>
                    </div>
                </main>
            </>
        )
    }

    if (!category) {
      return (
        <div className="min-w-0 flex-1">
            <Card className="mx-auto w-full max-w-5xl overflow-hidden border-border/60 bg-background shadow-sm">
                <CardContent className="flex min-h-[360px] flex-col items-center justify-center px-6 py-12 text-center">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                        <AlertCircle className="h-10 w-10 text-muted-foreground" />
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
                        asChild
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

    // Check if category has products based on price range
    let hasProducts = true;
    if (minPrice === 0 && maxPrice === 10000) {
        hasProducts = false;
    }

    return (
        <>
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
                    {/* Header / Category Info */}
                    <CategoryHeaderSection category={category} />

                    {/* Subcategories */}
                    <SubcategoriesSection slug={slug} category={category} categories={categories} />

                    <Separator />

                    <div className="px-2 mb-2">
                        {/* Desktop */}
                        <div className="hidden lg:block">
                            <SortSelect hasProducts={hasProducts} value={sort} onChange={setSort} />
                        </div>

                        {/* Mobile */}
                        <div className="flex items-center justify-between lg:hidden">
                            <MobileCategorySidebar
                                hasProducts={hasProducts}
                                isLoading={isLoading}
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

                    {/* Footer / Category description */}
                    <CategoryFooterSection category={category} />
                </div>
            </main>
        </>
    );
}
