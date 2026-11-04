'use client'

import { Card, CardContent } from "@/components/ui/card";
import { useFullSearch } from "@/hooks/use-full-search";
import { ProductCard } from "../category/product-card";
import { CurrencyCode } from "@/types/currency";
import SimpleNotFoundCard from "@/components/common/SimpleNoFoundCard";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import CategoryImage from "../category/CategoryImage";
import Image from 'next/image'
import { useSearchFilters } from "@/hooks/use-search-filters";
import { useState } from "react";
import { SortSelectValue } from "@/types/category";
import { CategorySidebar } from "../category/CategorySidebar";
import { SortSelect } from "../category/SortSelect";

type SearchComponentProps = {
    q: string | undefined;
    locale: string;
    currency: CurrencyCode;
}

export function SearchComponent({q, locale, currency}: SearchComponentProps) {
    const t = useTranslations('frontend')
    const { data: filterData, isLoading: isFilterLoading } = useSearchFilters({q: q ? q : "", locale: locale});
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
            price,
            activeMaterials,
            currency
        });

    const products = data?.pages.flatMap(page => page.products.data) ?? [];
    const categories = data?.pages[0].categories ?? [];

    if (isLoading) {
        // return (
        //     <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        //         {Array.from({ length: 8 }).map((_, i) => (
        //             <Card key={i}>
        //                 <CardContent className="p-4 space-y-2">
        //                     <div className="h-4 w-3/4 rounded bg-muted" />
        //                     <div className="h-3 w-1/2 rounded bg-muted" />
        //                 </CardContent>
        //             </Card>
        //         ))}
        //     </div>
        // );
    }

    let hasProducts = true;
    if (minPrice === 0 && maxPrice === 10000) {
        hasProducts = false;
    }

    // if (!products.length && !categories.length) {
    //     return <SimpleNotFoundCard title={t('search.no_results')} description={t('search.no_results_description')}/>
    // }
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
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                                {products.map(product => (
                                    <ProductCard key={product.id} product={product} />
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
                </div>
            </main>
        </div>
    );
}
