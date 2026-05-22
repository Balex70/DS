"use client";

import ProductImage from "./ProductImage";
import { useProduct } from "@/hooks/use-product";

type Props = {
    productId: string;
};

export function ProductDetail({ productId }: Props) {
    const {data: product, error, isLoading} = useProduct(productId);
    
    if (error?.response?.status === 404) {
        return (
            <h2>Product not found (redirect or show nice 404)</h2>
        )
    }
    
    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="space-y-4">
                        <div className="h-4 w-3/4 rounded bg-muted" />
                        <div className="h-3 w-1/2 rounded bg-muted" />
                    </div>
                    <div className="space-y-4">
                        <div className="h-4 w-3/4 rounded bg-muted" />
                        <div className="h-3 w-1/2 rounded bg-muted" />
                    </div>
                </div>
            </div>
        );
    }
    
    if (!product) {
        return (
            <h2>Product not found (redirect or show nice 404)</h2>
        )
    }
    return (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* IMAGE */}
            <div className="space-y-4">
                <div className="relative aspect-square rounded-lg border bg-muted overflow-hidden">
                    {product.big_image?.url ? (
                        <ProductImage
                            src={`/storage/${product.big_image.original_url}`}
                            alt={product.name_processed ?? product.name_raw}
                            imageClassName="object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            No image
                        </div>
                    )}
                </div>
            </div>

            {/* INFO */}
            <div className="space-y-4">
                <h1 className="text-2xl font-semibold">
                    {product.name_processed ?? product.name_raw}
                </h1>

                <div className="text-3xl font-bold">
                    ${product.price}
                </div>

                <div>
                    {product.warehouse_inventory_num > 0 ? (
                        <p className="text-green-600">In stock</p>
                    ) : (
                        <p className="text-red-500">Out of stock</p>
                    )}
                </div>

                {/* DESCRIPTION (if you have it) */}
                {product.description_processed && (
                    <div className="prose max-w-none text-sm text-muted-foreground">
                        {product.description_processed}
                    </div>
                )}

                {/* ACTIONS */}
                <div className="flex gap-3 pt-4">
                    <button className="rounded-md bg-black px-4 py-2 text-white hover:opacity-90">
                        Add to cart
                    </button>

                    <button className="rounded-md border px-4 py-2">
                        Buy now
                    </button>
                </div>
            </div>
        </div>
    );
}
