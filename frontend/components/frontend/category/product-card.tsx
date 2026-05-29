"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/types/product";
import ProductImage from "./ProductImage";
import Link from "next/link";
import { useAddToCart } from "@/hooks/use-add-to-cart";
import { PriceRenderer } from "@/components/custom/PriceRenderer";

type Props = {
    product: Product;
};

export function ProductCard({ product }: Props) {
    const { mutate: addToCart, isPending } = useAddToCart();

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({
            product_id: product.id,
            title: product.name_processed ?? product.name_raw,
            sku: product.sku,
            quantity: 1,
            price: product.price, // product.price,
            image: product.big_image?.original_url ?? undefined,
            product_weight: product.product_weight ?? undefined,
            packing_weight: product.packing_weight ?? undefined
        });
    };
    return (
        <Card className="overflow-hidden transition hover:shadow-md pb-0">
            <Link
                href={`/product/${product.id}`}
                className="group block"
            >
                <div className="relative aspect-square bg-muted">
                    {product.big_image?.url ? (
                        <ProductImage
                                src={`/storage/${product.big_image.original_url}`}
                                alt={product.name_processed ? product.name_processed : product.name_raw}
                                imageClassName="object-cover transition duration-300 group-hover:scale-105"
                            />
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                            No image
                        </div>
                    )}
                </div>
            </Link>

            <CardContent className="space-y-2 p-3">
                <h3 className="line-clamp-2 text-sm font-medium">
                    {product.name_processed ? product.name_processed : product.name_raw}
                </h3>

                <div className="text-lg font-semibold">
                    <PriceRenderer value={product.price} />
                </div>

                {product.warehouse_inventory_num > 0 ? (
                    <p className="text-xs text-green-600">
                        In stock
                    </p>
                ) : (
                    <p className="text-xs text-red-500">
                        Out of stock
                    </p>
                )}
                <button
                    onClick={handleAddToCart}
                    disabled={isPending}
                    className="rounded-md bg-black px-4 py-2 text-white hover:opacity-90 disabled:opacity-50"
                >
                    {isPending ? "Adding..." : "Add to cart"}
                </button>
            </CardContent>
        </Card>
    );
}
