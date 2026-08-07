"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useCategories } from "@/hooks/use-categories";
import { Link } from "@/i18n/navigation";
import CategoryImage from "./CategoryImage";
import Image from 'next/image'
import { Separator } from "@/components/ui/separator";
import { CategoryBreadcrumbs } from "./category-breadcrumbs";
import { useLocale } from "next-intl";

type Props = {
    slug: string[];
};

export function SubcategoriesSection({ slug }: Props) {
    const { data: categories, isLoading } = useCategories();
    const locale = useLocale();
    
    const lastSlug = slug[slug.length - 1];
    const category = categories?.find((c) => c.slug === lastSlug);
    const subcategories = categories?.filter((c) => c.parent_id === category?.id);

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-4 space-y-2">
                            <div className="h-4 w-3/4 rounded bg-muted" />
                            <div className="h-3 w-1/2 rounded bg-muted" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (!category) {
        return (
            <p className="text-sm text-muted-foreground">
                Category not found.
            </p>
        );
    }

    if (!subcategories?.length) {
        return (
            <>
                <Separator />
                <CategoryBreadcrumbs slug={slug} />
            </>
        );
    }

    return (
        <>
            <Separator />
            <CategoryBreadcrumbs slug={slug} />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {subcategories.map((category) => {
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
    );
}
