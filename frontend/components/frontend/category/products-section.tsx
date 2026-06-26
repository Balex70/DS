"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "./product-card";
import { Product } from "@/types/product";

type Props = {
    data?: {
        pages: {
            data: Product[];
        }[];
    };
    isLoading: boolean;
    fetchNextPage: () => void;
    hasNextPage?: boolean;
    isFetchingNextPage: boolean;
};

export function ProductsSection({
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
}: Props) {

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
        return <p className="text-sm text-muted-foreground">No Products</p>;
    }

    return (
        <div className="space-y-4">
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
