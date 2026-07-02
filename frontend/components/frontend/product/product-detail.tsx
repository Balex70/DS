"use client";

import { useProduct } from "@/hooks/use-product";
import ProductGallery from "./ProductGallery";
import { useAddToCart } from "@/hooks/use-add-to-cart";
import { PriceRenderer } from "@/components/custom/PriceRenderer";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLocale } from 'next-intl';

type Props = {
    productId: string;
};

export function ProductDetail({ productId }: Props) {
    const { data: product, error, isLoading } = useProduct(productId);
    const { mutate: addToCart, isPending } = useAddToCart();
    const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
    const locale = useLocale();

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

    const selectedVariant = product?.variants?.find(v => v.id === selectedVariantId)
        ?? product?.variants?.[0];

    const activeVariantId = selectedVariant?.id;
    const galleryMainImage = selectedVariant?.image ?? product.big_image;
    const variantTranslation = selectedVariant?.translations.find((item) => item.locale === locale);
    const translation = product?.translations.find((item) => item.locale === locale);

    const title = variantTranslation?.name ?? selectedVariant.name_processed ?? selectedVariant.name ?? product.name_processed ?? product.name_raw;  // TODO: use variant_id instead title in case user change locale show correct title

    const handleAddToCart = async () => {
        addToCart({
            product_id: selectedVariant.id,
            vid: selectedVariant.external_id,
            title: title,
            sku: selectedVariant.sku,
            quantity: 1,
            price: selectedVariant.price, // product.price,
            image: selectedVariant.image?.original_url ?? undefined,
            product_weight: selectedVariant.weight ?? undefined,
            packing_weight: product.packing_weight ?? undefined
        });
    };

    return (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* IMAGE */}
            <ProductGallery
                bigImage={galleryMainImage}
                images={product.images}
                productName={title}
            />

            {/* INFO */}
            <div className="space-y-4">
                <h1 className="text-2xl font-semibold">
                    {title}
                </h1>

                <div className="text-3xl font-bold">
                    <PriceRenderer value={selectedVariant?.price ?? product.price} />
                </div>

                <div>
                    {(selectedVariant?.stock ?? product.warehouse_inventory_num) > 0 ? (
                        <p className="text-green-600">In stock</p>
                    ) : (
                        <p className="text-red-500">Out of stock</p>
                    )}
                </div>

                {/* DESCRIPTION (if you have it) */}
                {product.description_processed && (
                    <div className="prose max-w-none text-sm text-muted-foreground">
                        {translation?.description ?? product.description_processed ?? product.description_raw}
                    </div>
                )}

                {product.variants?.length > 0 && (
                    <div className="space-y-2">
                        <div className="text-sm font-medium text-muted-foreground">
                            Variant
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {product.variants.map((variant) => {
                                const isSelected = variant.id === activeVariantId;

                                return (
                                    <button
                                        key={variant.id}
                                        onClick={() => setSelectedVariantId(variant.id)}
                                        className={cn(
                                            "rounded-lg border px-3 py-1.5 text-sm transition-all",
                                            isSelected
                                                ? "cursor-default border-green-600 bg-green-50 text-black"
                                                : "cursor-pointer border-muted bg-background text-foreground hover:border-gray-100 hover:bg-gray-100 hover:text-black"
                                        )}
                                    >
                                        {variant.key}
                                    </button>
                                );
                            })}
                        </div>
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
