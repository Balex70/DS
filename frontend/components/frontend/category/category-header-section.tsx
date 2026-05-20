"use client";

import { useCategories } from "@/hooks/use-categories";

type Props = {
    slug: string;
};

export function CategoryHeaderSection({ slug }: Props) {
    const { data: categories, isLoading } = useCategories();
    
    const category = categories?.find((c) => c.slug === slug);

    if (isLoading) {
        return (
            <div className="space-y-2">
                <h1 className="text-2xl font-semibold">Category Title</h1>
                <p className="text-sm text-muted-foreground">
                    Category description goes here. This will later come from API.
                </p>
            </div>
        );
    }

    if (!category) {
        return (
            <p className="text-sm text-muted-foreground">
                Category not found.
            </p>
        );
    }

    return (
        <div className="space-y-2">
            <h1 className="text-2xl font-semibold">{category.name}</h1>
            <p className="text-sm text-muted-foreground">
                Category description goes here. This will later come from API.
            </p>
        </div>
    );
}
