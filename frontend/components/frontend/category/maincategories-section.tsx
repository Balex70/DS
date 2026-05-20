"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useCategories } from "@/hooks/use-categories";
import Link from "next/link";

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
                    <Card className="h-32 w-full cursor-pointer transition hover:shadow-md">
                        <CardContent className="flex h-full items-center justify-center p-6 text-center">
                            <div className="font-medium">
                                {category.name}
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    );
}
