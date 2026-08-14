"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import { ProductCard } from "../category/product-card";
import { useLocale, useTranslations } from "next-intl";

type Props = {
    category: Category;
    products?: Product[];
};

export function CategorySection({
    category,
    products,
}: Props) {
    const locale = useLocale();
    const t = useTranslations('frontend')

    if (!products?.length) {
        return null;
    }
    
    const translation = category?.translations.find((item) => item.locale === locale);

    return (
        <section className="space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
                <h2 className="text-2xl font-bold">
                    {translation?.name ?? category.name}
                </h2>

                <Button
                    asChild
                    variant="ghost"
                >
                    <Link href={`/category/${category.slug}`}>
                        {t('main.categories_section.view_all')} →
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="w-full"
                    >
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </section>
    );
}
