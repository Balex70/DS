'use client'

import { Card, CardContent } from "@/components/ui/card";
import { useFullSearch } from "@/hooks/use-full-search";
import { CurrencyCode } from "@/types/currency";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import CategoryImage from "../category/CategoryImage";
import Image from 'next/image'
import { useState } from "react";
import { SortSelectValue } from "@/types/category";
import { SortSelect } from "../category/SortSelect";
import { MobileSortSelect } from "../category/MobileSortSelect";
import { Search } from "lucide-react";
import { SearchProductCard } from "./product-card";
import { SearchSidebar } from "./SearchSidebar";
import { MobileSearchSidebar } from "./MobileSearchSidebar";

type SearchComponentProps = {
    q: string | undefined;
    locale: string;
    currency: CurrencyCode;
}

export function SearchComponent({q, locale, currency}: SearchComponentProps) {
    const t = useTranslations('frontend')
    const [sort, setSort] = useState<SortSelectValue>("latest");

    const [filterState, setFilterState] = useState({
        q,
        price: null as [number, number] | null,
        priceDraft: null as [number, number] | null,
        activeMaterials: [] as number[],
    });
    const currentFilters = filterState.q === q
        ? filterState
        : {
            q,
            price: null,
            priceDraft: null,
            activeMaterials: [],
        };

    const activePrice = currentFilters.price ?? [0, 10000];
    const activeMaterials = currentFilters.activeMaterials;

    const {
            data,
            isLoading,
            fetchNextPage,
            hasNextPage,
            isFetchingNextPage,
        } = useFullSearch({
            q: q ? q : "",
            locale,
            sort,
            price: activePrice,
            activeMaterials,
            currency
        });

    const filterData = data?.pages[0]?.filters;

    const minPrice = filterData?.price.min ?? 0;
    const maxPrice = filterData?.price.max ?? 10000;

    const defaultPrice: [number, number] = [minPrice, maxPrice];
    const priceDraft = currentFilters.priceDraft ?? defaultPrice;

    const setPrice = (price: [number, number]) => {
        setFilterState(prev => ({
            ...prev,
            q,
            price,
        }));
    };
    const setPriceDraft = (priceDraft: [number, number]) => {
        setFilterState(prev => ({
            ...prev,
            q,
            priceDraft,
        }));
    };
    const setActiveMaterials = (activeMaterials: number[]) => {
        setFilterState(prev => ({
            ...prev,
            q,
            activeMaterials,
        }));
    };

    const products = data?.pages.flatMap(page => page.products.data) ?? [];
    const categories = data?.pages[0].categories ?? [];

    console.log('products');
    console.log(products);

    const hasProducts = (data?.pages[0]?.products.meta.total ?? 0) > 0;

    return (
        <div className="space-y-6">
            {q && (
                <h1 className="text-xl font-semibold tracking-tight">
                    {t("search.results_for", { query: q })}
                </h1>
            )}
            <div className="flex w-full gap-6">
                <aside className="hidden w-72 shrink-0 lg:block">
                    {!isLoading &&
                        <SearchSidebar
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
                    <div className="space-y-4">
                        {categories.length > 0 && (
                            <>
                                <h2 className="mb-4 text-xl font-semibold">
                                    {t('search.categories')}
                                </h2>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                                    {categories.map((category) => {
                                        const translation = category?.translations.find((item) => item.locale === locale);
                                        return (
                                            <Link
                                                key={category.id}
                                                href={`/category/${category.full_path}`}
                                                className="block"
                                            >
                                                <Card className="h-14 overflow-hidden py-0 hover:bg-muted/50 transition rounded-md">
                                                    <CardContent className="flex h-full items-center gap-3 p-0">

                                                        {/* Wide image */}
                                                        <div className="relative h-full w-14 shrink-0 overflow-hidden bg-muted">
                                                            {category.image ? (
                                                                <CategoryImage
                                                                    src={`/storage/${category.image}`}
                                                                    alt={translation?.name ?? category.name}
                                                                    imageClassName="object-cover"
                                                                />
                                                            ) : (
                                                                <Image
                                                                    src="/categories/placeholder.jpg"
                                                                    alt={translation?.name ?? category.name}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            )}
                                                        </div>

                                                        {/* Name */}
                                                        <div className="min-w-0 flex-1">
                                                            <div className="line-clamp-2 text-xs md:text-sm font-medium leading-tight mr-3">
                                                                {(translation?.name != undefined && translation?.name != '') ? translation?.name : category.name}
                                                            </div>
                                                        </div>

                                                    </CardContent>
                                                </Card>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                        {products.length > 0 && (
                            <>
                                <h2 className="mb-4 text-xl font-semibold">
                                    Products ({products.length})
                                </h2>
                                {/* Desktop */}
                                <div className="hidden lg:block">
                                    <SortSelect hasProducts={hasProducts} value={sort} onChange={setSort} />
                                </div>
                                {/* Mobile */}
                                <div className="flex items-center justify-between lg:hidden">
                                    <MobileSearchSidebar
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
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                                    {products.map(product => (
                                        <SearchProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {hasNextPage && (
                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => fetchNextPage()}
                                            disabled={isFetchingNextPage}
                                            className="px-4 py-2 text-sm border rounded"
                                        >
                                            {isFetchingNextPage ? "Loading..." : "Load more"}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                        {(!products.length && !categories.length && !isLoading) && (
                            <Card className="mt-0">
                                <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                        <Search className="h-5 w-5 text-muted-foreground" />
                                    </div>

                                    <h2 className="text-lg font-semibold">
                                        {t("search.no_results")}
                                    </h2>

                                    <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                        {t("search.no_results_description")}
                                    </p>

                                    <p className="mt-3 text-sm">
                                        <span className="text-muted-foreground">
                                            {t("search.searched_for")}
                                        </span>{" "}
                                        <span className="font-medium">&quot;{q}&quot;</span>
                                    </p>
                                </div>
                            </Card>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
