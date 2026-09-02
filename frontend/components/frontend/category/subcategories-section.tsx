"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import CategoryImage from "./CategoryImage";
import Image from 'next/image'
import { Separator } from "@/components/ui/separator";
import { CategoryBreadcrumbs } from "./category-breadcrumbs";
import { useLocale } from "next-intl";
import { Category } from "@/types/category";

type Props = {
    slug: string[];
    category?: Category;
    categories?: Category[];
};

export function SubcategoriesSection({
    slug,
    category,
    categories,
}: Props) {
    const locale = useLocale();
    const subcategories = categories?.filter((c) => c.parent_id === category?.id);

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
