"use client";

import { Category } from "@/types/category";
import { useLocale } from "next-intl";

type Props = {
    category?: Category;
};

export function CategoryHeaderSection({
    category
}: Props) {
    const locale = useLocale();
    const translation = category?.translations.find((item) => item.locale === locale);

    return (
        <div className="space-y-2">
            <h1 className="text-md md:text-lg font-semibold">{(translation?.name != undefined && translation?.name != '') ? translation?.name : category?.name}</h1>
        </div>
    );
}
