"use client";

import Link from "next/link";
import { useLocale, useTranslations } from 'next-intl'
import { useCategories } from "@/hooks/use-categories";

export default function FooterCategoriesSection() {
    const { data: categories, isLoading } = useCategories();
    const t = useTranslations('frontend')
    const locale = useLocale();
    
    if (!categories?.length) {
        return null;
    }

    return (
        <div className="border-t py-6">
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide">
                {t('footer.shop_by_category')}
            </h2>

            <div className="flex flex-wrap gap-x-2 sm:gap-x-5 gap-y-2 sm:gap-y-3">
                {categories.map((category) => {
                    const translation = category?.translations.find((item) => item.locale === locale);
                    return (
                        <Link
                            key={category.id}
                            href={`/category/${category.full_path}`}
                            className="rounded-2xl border px-3 py-1.5 text-xs sm:text-sm transition-all cursor-pointer border-muted bg-background/50 text-foreground hover:border-gray-100 hover:bg-gray-100 hover:text-black"
                        >
                            {(translation?.name && translation?.name !== '') ? translation.name : category.name ?? category.slug}
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}
