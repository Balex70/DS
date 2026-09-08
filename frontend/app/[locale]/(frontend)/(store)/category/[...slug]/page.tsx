import { Metadata } from "next";
import { CategoryComponent } from "@/components/frontend/category/category-component";
import { getCategories } from "@/actions/categoryActions";
import { notFound } from "next/navigation";
import { CategoryFooterSection } from "@/components/frontend/category/category-footer-section";
import { CategoryHeaderSection } from "@/components/frontend/category/category-header-section";
import { SubcategoriesSection } from "@/components/frontend/category/subcategories-section";
import { Separator } from "@/components/ui/separator";

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
        <div className="w-full space-y-6">
            {/* Row 1: Category Header + Subcategories */}
            <section className="space-y-3">
                <CategoryHeaderSection category={category} />

                <SubcategoriesSection
                    slug={slug}
                    category={category}
                    categories={categories}
                />
            </section>
            <Separator className="mb-2" />

            {/* Row 2: Sidebar + Products */}
            <CategoryComponent
                slug={slug}
                locale={locale}
            />

            {/* Row 3: Category Footer */}
            <section>
                <CategoryFooterSection category={category} />
            </section>
        </div>
    );
}
