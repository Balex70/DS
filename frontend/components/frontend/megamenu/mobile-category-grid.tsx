'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Category } from "@/types/category";
import CategoryImage from "../category/CategoryImage";
import Image from 'next/image'
import { useLocale, useTranslations } from "next-intl";
import { ScrollArea } from "@/components/ui/scroll-area";
import SimpleNotFoundCard from "@/components/common/SimpleNoFoundCard";

export function MobileCategoryGrid({
    categories,
    onSelect,
}: {
    categories: Category[],
    onSelect: (category: Category) => void
}
) {
    const locale = useLocale();
    const t = useTranslations('frontend')

    if (!categories.length) {
        return (
            <SimpleNotFoundCard title={t('megamenu.no_categories')}/>
        );
    }
    
    return (
        <ScrollArea className="h-full">
            <div className="grid grid-cols-2 min-[500px]:grid-cols-3 sm:grid-cols-3 gap-3 p-2">
                {categories.map((category) => {
                    const translation = category?.translations.find((item) => item.locale === locale);
                    return (
                        <Card key={category.id} onClick={() => onSelect(category)} className="
                            !ring-0
                            !shadow-none
                            !rounded-lg
                            overflow-hidden
                            transition-shadow
                            shadow-sm
                            active:scale-[0.98]
                            border-none
                            outline-none
                            gap-1
                            px-2
                            pt-1
                            pb-2
                            ">
                            <div className="relative relative h-24 aspect-square">
                                {category.image
                                    ? <CategoryImage
                                        src={`/storage/${category.image}`}
                                        alt={translation?.name ?? category.name}
                                        imageClassName="object-cover transition duration-300 group-hover:scale-105 rounded-md"
                                    />
                                    : <Image
                                        src="/categories/placeholder.jpg"
                                        alt={translation?.name ?? category.name}
                                        fill
                                        className="object-cover transition duration-300 group-hover:scale-105 rounded-md"
                                    />
                                }
                            </div>

                            <CardContent className="flex h-12 items-center justify-center p-0">
                                <p className="line-clamp-2 text-center text-sm font-medium">
                                    {translation?.name ?? category.name}
                                </p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </ScrollArea>
    );
}
