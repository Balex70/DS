"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useCategories } from "@/hooks/use-categories";
import { Category } from "@/types/category";

export function Sidebar() {
    const { data, isLoading } = useCategories();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="rounded-lg border bg-card">
            <div className="border-b p-4">
                <h2 className="font-semibold">
                    Categories
                </h2>
            </div>

            <ScrollArea className="h-[calc(100vh-12rem)]">
                <div className="space-y-1 p-2">
                    {data?.filter((category: Category) => category.parent_id === null)
                        .map((category: Category) => (
                        <div key={category.id}>
                            {category.name}
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
