"use client";

import SimpleSkeletonLoader from "@/components/common/SimpleSkeletonLoader";
import { Category } from "@/types/category";
import { useLocale, useTranslations } from "next-intl";

type Props = {
    category?: Category;
    isLoading?: boolean;
};

export function CategoryHeaderSection({
    category,
    isLoading
}: Props) {
    const locale = useLocale();
    const t = useTranslations('frontend')
    const translation = category?.translations.find((item) => item.locale === locale);

    if (isLoading) {
        return <SimpleSkeletonLoader label={t('loading_loader')} className="p-4" />;
    }

    return (
        <div className="space-y-2">
            <h1 className="text-md md:text-lg font-semibold">{(translation?.name != undefined && translation?.name != '') ? translation?.name : category?.name}</h1>
        </div>
    );
}
