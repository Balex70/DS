"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useCategories } from "@/hooks/use-categories";
import Link from "next/link";
import Image from 'next/image'
import CategoryImage from "@/components/frontend/category/CategoryImage";

export function MaincategoriesSection() {
    const { data: categories, isLoading } = useCategories();
    
    const maincategories = categories?.filter((c) => c.parent_id === null);

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

    if (!maincategories) {
        return (
            <p className="text-sm text-muted-foreground">
                Categories not found.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {maincategories.map((category) => (
                <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="block"
                >
                    <Card className="group relative h-40 overflow-hidden py-0">
                        <CardContent className="relative h-full p-0">
                            {category.image
                                ? <CategoryImage
                                    src={`/storage/${category.image}`}
                                    alt={category.name}
                                    imageClassName="object-cover transition duration-300 group-hover:scale-105"
                                />
                                : <Image
                                    src="/categories/placeholder.jpg"
                                    alt={category.name}
                                    fill
                                    className="object-cover transition duration-300 group-hover:scale-105"
                                />
                            }

                            <div className="absolute inset-0 bg-black/75" />

                            <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                                <div className="text-xl font-semibold text-white">
                                    {category.name}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    );
}
