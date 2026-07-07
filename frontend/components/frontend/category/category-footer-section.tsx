"use client";

import { useCategories } from "@/hooks/use-categories";
import { useLocale } from "next-intl";

type Props = {
    slug: string[];
};

export function CategoryFooterSection({ slug }: Props) {
    const { data: categories, isLoading } = useCategories();
    const locale = useLocale();

    const lastSlug = slug[slug.length - 1];
    const category = categories?.find((c) => c.slug === lastSlug);
    const translation = category?.translations.find((item) => item.locale === locale);

    if (isLoading) {
        return (
            <div className="space-y-2">
                <p className="text-md text-muted-foreground">
                    ...
                </p>
            </div>
        );
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
