'use client'

import Link from "next/link";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useCategories } from "@/hooks/use-categories";
import { Category } from "@/types/category";
import { useLocale } from "next-intl";
import { Fragment } from "react";

function buildBreadcrumbs(slug: string[], categories?: Category[], locale?: string) {
    return slug.map((segment, index) => {
        const category = categories?.find((c) => c.slug === segment);
        const translation = category?.translations.find((item) => item.locale === locale);
        return {
            label: ((translation?.name != undefined && translation?.name != '') ? translation?.name : category?.name) || segment,
            href: "/category/" + slug.slice(0, index + 1).join("/"),
        };
    });
}
export function CategoryBreadcrumbs({ slug }: { slug: string[] }) {
    const { data: categories } = useCategories();
    const locale = useLocale();
    
    const items = buildBreadcrumbs(slug, categories, locale);

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/">Home</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>

                {items.map((item, index) => (
                    <Fragment key={item.href}>
                        <BreadcrumbSeparator />

                        <BreadcrumbItem>
                            {index === items.length - 1 ? (
                                <span className="font-medium text-foreground">
                                    {item.label}
                                </span>
                            ) : (
                                <BreadcrumbLink asChild>
                                    <Link href={item.href}>
                                        {item.label}
                                    </Link>
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                    </Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
