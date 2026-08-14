"use client";

import SimpleSkeletonLoader from "@/components/common/SimpleSkeletonLoader";
import { useCategories } from "@/hooks/use-categories";
import { useLocale, useTranslations } from "next-intl";

type Props = {
    slug: string[];
};

export function CategoryHeaderSection({ slug }: Props) {
    const { data: categories, isLoading } = useCategories();
    const locale = useLocale();
    const t = useTranslations('frontend')
    const lastSlug = slug[slug.length - 1];
    const category = categories?.find((c) => c.slug === lastSlug);
    const translation = category?.translations.find((item) => item.locale === locale);

    if (isLoading) {
        return <SimpleSkeletonLoader label={t('loading_loader')} className="p-4" />;
    }

    if (!category) {
        return (
            <p className="text-sm text-muted-foreground">
                {t('category.category_not_found')}
            </p>
        );
    }

    return (
        <div className="space-y-2">
            <h1 className="text-md md:text-lg font-semibold">{(translation?.name != undefined && translation?.name != '') ? translation?.name : category.name}</h1>
        </div>
    );
}
