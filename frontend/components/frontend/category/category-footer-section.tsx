"use client";

import SimpleSkeletonLoader from "@/components/common/SimpleSkeletonLoader";
import { Category } from "@/types/category";
import { useLocale, useTranslations } from "next-intl";

type Props = {
    category?: Category;
    isLoading?: boolean;
};

export function CategoryFooterSection({
    category,
    isLoading
}: Props) {
    const locale = useLocale();
    const t = useTranslations('frontend')
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
