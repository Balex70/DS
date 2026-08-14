"use client";

import SimpleSkeletonLoader from "@/components/common/SimpleSkeletonLoader";
import { useCategories } from "@/hooks/use-categories";
import { useLocale, useTranslations } from "next-intl";

type Props = {
    slug: string[];
};

export function CategoryFooterSection({ slug }: Props) {
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
        return;
    }

    return (
        <div className="space-y-2">
            <p className="text-md text-muted-foreground">
                {translation?.description ?? category.description}
            </p>
        </div>
    );
}
