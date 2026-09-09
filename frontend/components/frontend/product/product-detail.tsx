"use client";

import ProductGallery from "./ProductGallery";
import { useAddToCart } from "@/hooks/use-add-to-cart";
import { PriceRenderer } from "@/components/custom/PriceRenderer";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from 'next-intl';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MobileVariantSelector from "./mobile-variant-selector";
import { Product } from "@/types/product";
import { CurrencyCode } from "@/types/currency";

type Props = {
    product: Product;
    currency: CurrencyCode;
};

export function ProductDetail({
    product,
    currency
}: Props) {
    const { mutate: addToCart, isPending } = useAddToCart();
    const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
    const locale = useLocale();
    const t = useTranslations('frontend')
    
    const selectedVariant = product?.variants?.find(v => v.id === selectedVariantId)
        ?? product?.variants?.[0];

    const activeVariantId = selectedVariant?.id;
    const galleryMainImage = selectedVariant?.image ?? product.big_image;
    const variantTranslation = selectedVariant?.translations.find((item) => item.locale === locale);

    const title = variantTranslation?.name ?? selectedVariant.name_processed ?? selectedVariant.name ?? product.name_processed ?? product.name_raw;

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
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 mb-10">
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

                <div className="text-3xl font-bold flex-col">
                    <PriceRenderer value={selectedVariant?.price ?? product.price} className="text-2xl font-semibold"/>
                    {(currency !== "USD" && selectedVariant?.currency_price && product.currency_price) && (
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                            (
                            <PriceRenderer
                                value={selectedVariant?.currency_price ?? product.currency_price}
                                currency={currency}
                            />
                            )
                        </span>
                    )}
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3 pt-4">
                    <button
                        onClick={handleAddToCart}
                        disabled={isPending}
                        className="rounded-md bg-black px-4 py-2 text-white hover:opacity-90 disabled:opacity-50"
                    >
                        {isPending ? t('product.adding') : t('product.add_to_cart')}
                    </button>
                </div>

                {product.variants?.length > 0 && (
                    <div className="space-y-2">
                        <div className="text-sm font-medium text-muted-foreground">
                            {t('product.options')}
                        </div>
                        {product.variants?.length > 10 ? (
                            <>
                                <div className="hidden lg:block">
                                    <Select
                                        value={activeVariantId?.toString()}
                                        onValueChange={(value) => setSelectedVariantId(Number(value))}
                                        >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select variant" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {product.variants.map((variant) => (
                                                <SelectItem
                                                    key={variant.id}
                                                    value={variant.id.toString()}
                                                >
                                                    {variant.key}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="lg:hidden">
                                    <MobileVariantSelector variants={product.variants} selectedVariant={selectedVariant} setSelectedVariantId={setSelectedVariantId} />
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {product.variants.map((variant) => {
                                    const isSelected = variant.id === activeVariantId;

                                    return (
                                        <button
                                            key={variant.id}
                                            onClick={() => setSelectedVariantId(variant.id)}
                                            className={cn(
                                                "rounded-2xl border px-3 py-1.5 text-sm transition-all",
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
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
