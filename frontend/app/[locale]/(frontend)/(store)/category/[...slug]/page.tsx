import { Metadata } from "next";
import { CategoryComponent } from "@/components/frontend/category/category-component";
import { getCategories } from "@/actions/categoryActions";
import { notFound } from "next/navigation";

type Props = {
    params: Promise<{
        locale: string;
        slug: string[];
    }>;
};

export async function generateMetadata({
    params,
}: Props): Promise<Metadata> {
    const { locale, slug } = await params;
    const categories = await getCategories();
    const lastSlug = slug[slug.length - 1];
    const category = categories.find((c) => c.slug === lastSlug);
    const translation = category?.translations.find((item) => item.locale === locale);

    if (!category) {
        return {
            title: "Category not found",
        };
    }

    return {
        title: (translation?.name != undefined && translation?.name != '') ? translation?.name : category?.name,
        description: (translation?.description != undefined && translation?.description != '') ? translation?.description : category?.description,
    };
}

export default async function CategoryPage({
    params,
}: Props) {
    const { locale, slug } = await params;
    const categories = await getCategories();
    const lastSlug = slug[slug.length - 1];
    const category = categories.find((c) => c.slug === lastSlug);

    if (!category) {
        notFound();
    }

    return (
        <CategoryComponent
            categories={categories}
            category={category}
            slug={slug}
            locale={locale}
            />
    );
}
