import { Link } from "@/i18n/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Category } from "@/types/category";
import { getLocale, getTranslations } from 'next-intl/server';
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
export async function CategoryBreadcrumbs({
    categories,
    slug
}: {
    categories?: Category[],
    slug: string[]
}) {
    const locale = await getLocale();
    const t = await getTranslations('frontend');
    
    const items = buildBreadcrumbs(slug, categories, locale);

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/">{t('category.breadcrumbs.home')}</Link>
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
