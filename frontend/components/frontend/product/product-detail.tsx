"use client";

import { useProduct } from "@/hooks/use-product";
import ProductGallery from "./ProductGallery";
import { useAddToCart } from "@/hooks/use-add-to-cart";
import { PriceRenderer } from "@/components/custom/PriceRenderer";

type Props = {
    productId: string;
};

export function ProductDetail({ productId }: Props) {
    const { data: product, error, isLoading } = useProduct(productId);
    const { mutate: addToCart, isPending } = useAddToCart();

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

    const handleAddToCart = async () => {
        addToCart({
            product_id: product.id,
            title: product.name_processed ?? product.name_raw,
            quantity: 1,
            price: product.price, // product.price,
            image: product.big_image?.original_url ?? undefined,
        });
    };

    return (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* IMAGE */}
            <ProductGallery
                bigImage={product.big_image}
                images={product.images}
                productName={product.name_processed ?? product.name_raw}
            />

            {/* INFO */}
            <div className="space-y-4">
                <h1 className="text-2xl font-semibold">
                    {product.name_processed ?? product.name_raw}
                </h1>

                <div className="text-3xl font-bold">
                    <PriceRenderer value={product.price} />
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
                    <button
                        onClick={handleAddToCart}
                        disabled={isPending}
                        className="rounded-md bg-black px-4 py-2 text-white hover:opacity-90 disabled:opacity-50"
                    >
                        {isPending ? "Adding..." : "Add to cart"}
                    </button>

                    <button className="rounded-md border px-4 py-2">
                        Buy now
                    </button>
                </div>
            </div>
        </div>
    );
}
