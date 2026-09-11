import { Metadata } from "next";
import { CategoryComponent } from "@/components/frontend/category/category-component";
import { getCategories } from "@/actions/categoryActions";
import { notFound } from "next/navigation";
import { CategoryFooterSection } from "@/components/frontend/category/category-footer-section";
import { CategoryHeaderSection } from "@/components/frontend/category/category-header-section";
import { SubcategoriesSection } from "@/components/frontend/category/subcategories-section";
import { Separator } from "@/components/ui/separator";
import { getSettings } from "@/actions/settingsActions";
import { defaultLocale } from "@/i18n/config";

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
    const [categories, settings] = await Promise.all([
        getCategories(),
        getSettings(),
    ]);

    const storeName = (settings?.["store.name"] && settings?.["store.name"] !== '') ? ' | ' + settings?.["store.name"] : '';
    const lastSlug = slug[slug.length - 1];
    const category = categories.find((c) => c.slug === lastSlug);
    const translation = category?.translations.find((item) => item.locale === locale);

    if (!category) {
        return {
            title: "Category not found",
        };
    }

    // Get locale meta title and description
    const localeMetaTitle = (translation?.meta_title != undefined && translation?.meta_title != '')
                    ? translation?.meta_title + storeName
                    : null;
    const localeMetaDescription = (translation?.meta_description != undefined && translation?.meta_description != '')
                    ? translation?.meta_description
                    : null;

    // Get locale title and description
    const localeTitle = (translation?.name != undefined && translation?.name != '')
                    ? translation?.name + storeName
                    : null;
    const localeDescription = (translation?.description != undefined && translation?.description != '')
                    ? translation?.description
                    : null;

    // Get meta title and description for default locale
    const defaultMetaTitle = category?.meta_title ? category?.meta_title + storeName : null
    const defaultMetaDescription = category?.meta_description ? category?.meta_description : null

    // Get final meta title and description
    let title = '';
    let description = '';
    if(locale === defaultLocale){
        title = defaultMetaTitle ?? category?.name + storeName;
        description = defaultMetaDescription ?? category?.description
    } else {
        title = localeMetaTitle ?? localeTitle ?? category?.name + storeName;
        description = localeMetaDescription ?? localeDescription ?? category?.description;
    }

    return {
        title: title,
        description: description,
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
