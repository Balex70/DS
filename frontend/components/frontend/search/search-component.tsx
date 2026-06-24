'use client'

import { Card, CardContent } from "@/components/ui/card";
import { useFullSearch } from "@/hooks/use-full-search";
import { ProductCard } from "../category/product-card";

interface SearchComponentProps {
    q: string | undefined;
}

export function SearchComponent({q}: SearchComponentProps) {
    const {
            data,
            isLoading,
            fetchNextPage,
            hasNextPage,
            isFetchingNextPage,
        } = useFullSearch({
            q: q ? q : "",
            sort: "latest",
        });

    const products = data?.pages.flatMap(page => page.data) ?? [];

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

    if (!products.length) {
        return <p className="text-sm text-muted-foreground">No results found for <span className="font-medium">&apos;{q}&apos;</span></p>;
    }
    return (
        <div className="space-y-4">
            <h2 className="mb-4 text-xl font-semibold">
                Products ({products.length})
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {hasNextPage && (
                <div className="flex justify-center">
                    <button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="px-4 py-2 text-sm border rounded"
                    >
                        {isFetchingNextPage ? "Loading..." : "Load more"}
                    </button>
                </div>
            )}
        </div>
    );
}
