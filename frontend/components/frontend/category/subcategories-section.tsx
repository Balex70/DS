"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useCategories } from "@/hooks/use-categories";

type Props = {
    slug: string;
};

export function SubcategoriesSection({ slug }: Props) {
    const { data: categories, isLoading } = useCategories();
    
    const category = categories?.find((c) => c.slug === slug);
    const subcategories = categories?.filter((c) => c.parent_id === category?.id);

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

    if (!category) {
        return (
            <p className="text-sm text-muted-foreground">
                Category not found.
            </p>
        );
    }

    if (!subcategories?.length) {
        return (
            <p className="text-sm text-muted-foreground">
                No subcategories available.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {subcategories.map((sub) => (
                <Card
                    key={sub.id}
                    className="cursor-pointer transition hover:shadow-md"
                >
                    <CardContent className="p-4">
                        <div className="font-medium text-sm">
                            {sub.name}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
