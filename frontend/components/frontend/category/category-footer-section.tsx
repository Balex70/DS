"use client";

import { Category } from "@/types/category";
import { useLocale } from "next-intl";

type Props = {
    category?: Category;
};

export function CategoryFooterSection({
    category,
}: Props) {
    const locale = useLocale();
    const translation = category?.translations.find((item) => item.locale === locale);

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
