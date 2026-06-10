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

function buildBreadcrumbs(slug: string[], categories?: Category[]) {
    return slug.map((segment, index) => {
        const name = categories?.find((c) => c.slug === segment)?.name;
        return {
            label: name || segment,
            href: "/category/" + slug.slice(0, index + 1).join("/"),
        };
    });
}
export function CategoryBreadcrumbs({ slug }: { slug: string[] }) {
    const { data: categories } = useCategories();
    
    const items = buildBreadcrumbs(slug, categories);

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/">Home</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>

                {items.map((item, index) => (
                    <BreadcrumbItem key={item.href}>
                        <BreadcrumbSeparator />

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
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
