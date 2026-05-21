"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/types/product";
import ProductImage from "./ProductImage";
import Link from "next/link";

type Props = {
    product: Product;
};

export function ProductCard({ product }: Props) {
    return (
        <Link
            href={`/product/${product.id}`}
            className="group block"
        >
            <Card className="overflow-hidden transition hover:shadow-md">
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

                <CardContent className="space-y-2 p-3">
                    <h3 className="line-clamp-2 text-sm font-medium">
                        {product.name_processed}
                    </h3>

                    <div className="text-lg font-semibold">
                        ${product.price}
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
                </CardContent>
            </Card>
        </Link>
    );
}
