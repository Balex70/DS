"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

import { Category } from "@/types/category";
import { Product } from "@/types/product";
import { ProductCard } from "../category/product-card";
import { useLocale } from "next-intl";

type Props = {
    category: Category;
    products?: Product[];
};

export function CategorySection({
    category,
    products,
}: Props) {
    const locale = useLocale();
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
                        View all →
                    </Link>
                </Button>
            </div>

            <div className="flex flex-wrap gap-5">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="
                            w-[calc(50%-0.5rem)]
                            sm:w-[180px]
                            md:w-[190px]
                            lg:w-[200px]
                            shrink-0"
                    >
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </section>
    );
}
