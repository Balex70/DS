"use client";

import ProductGallery from "./ProductGallery";
import { useAddToCart } from "@/hooks/use-add-to-cart";
import { PriceRenderer } from "@/components/custom/PriceRenderer";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from 'next-intl';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MobileVariantSelector from "./mobile-variant-selector";
import { Product, ProductVariant } from "@/types/product";
import { CurrencyCode } from "@/types/currency";
import { useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { stockUpdate } from "@/services/product-variant-service";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Props = {
    product: Product;
    selectedVariant: ProductVariant;
    currency: CurrencyCode;
};

export function ProductDetail({
    product,
    selectedVariant,
    currency
}: Props) {
    const { mutate: addToCart, isPending } = useAddToCart();
    const locale = useLocale();
    const t = useTranslations('frontend')
    const router = useRouter();
    const [stock, setStock] = useState(selectedVariant.stock);
    const [isStockUpdating, setIsStockUpdating] = useState(selectedVariant.stock_needs_update);
    
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
            image: selectedVariant.image?.original_url ?? product.big_image?.original_url ?? undefined,
            product_weight: selectedVariant.weight ?? undefined,
            packing_weight: product.packing_weight ?? undefined
        });
    };

    useEffect(() => {
        if (!selectedVariant.stock_needs_update) {
            return;
        }

        const updateStock = async () => {
            setIsStockUpdating(true);

            try {
                const data = await stockUpdate(selectedVariant.id);

                setStock(data.stock);
            } catch (error) {
                console.error('STOCK UPDATE FAILED:', error);
            } finally {
                setIsStockUpdating(false);
            }
        };

        updateStock();
    }, [selectedVariant.id, selectedVariant.stock_needs_update]);

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
                    <div className="flex items-center mt-2">
                        {isStockUpdating ? (
                            <Badge
                                variant="outline"
                                className="min-h-7 gap-1.5 border-amber-600/20 bg-amber-50/50 px-2.5 py-1 text-sm text-amber-700/70"
                            >
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                Checking availability...
                            </Badge>
                        ) : stock === null ? (
                            <Badge
                                variant="outline"
                                className="min-h-7 px-2.5 py-1 text-sm text-muted-foreground"
                            >
                                Availability unknown
                            </Badge>
                        ) : stock === 0 ? (
                            <Badge
                                variant="outline"
                                className="min-h-7 border-red-600/20 bg-red-50/50 px-2.5 py-1 text-sm text-red-700/60"
                            >
                                Out of stock
                            </Badge>
                        ) : stock <= 10 ? (
                            <Badge
                                variant="outline"
                                className="min-h-7 border-amber-600/20 bg-amber-50/50 px-2.5 py-1 text-sm text-amber-700/70"
                            >
                                Only {stock} left
                            </Badge>
                        ) : (
                            <Badge
                                variant="outline"
                                className="min-h-7 border-green-600/70 bg-green-50/50 px-2.5 py-2 text-sm text-green-700"
                            >
                                In stock
                            </Badge>
                        )}
                    </div>

                </div>

                {/* ACTIONS */}
                <div className="flex gap-3 pt-4">
                    <button
                        onClick={handleAddToCart}
                        disabled={isPending || isStockUpdating || stock === 0}
                        className="rounded-md bg-black px-4 py-2 text-white hover:opacity-90 disabled:opacity-50"
                    >
                        {isPending ? t('product.adding') : t('product.add_to_cart')}
                    </button>
                </div>

                {product.variants?.length > 1 && (
                    <div className="space-y-2">
                        <div className="text-sm font-medium text-muted-foreground">
                            {t('product.options')}
                        </div>
                        {product.variants?.length > 10 ? (
                            <>
                                <div className="hidden lg:block">
                                    <Select
                                        value={selectedVariant.external_id.toString()}
                                        onValueChange={(externalId) => {
                                            router.push(
                                                `/product/${product.id.toString()}/${externalId}`
                                            );
                                        }}
                                        >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select variant" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {product.variants.map((variant) => (
                                                <SelectItem
                                                    key={variant.external_id}
                                                    value={variant.external_id.toString()}
                                                >
                                                    {variant.key}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="lg:hidden">
                                    <MobileVariantSelector product={product} variants={product.variants} selectedVariant={selectedVariant} />
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {product.variants.map((variant) => {
                                    const isSelected = variant.id === activeVariantId;

                                    return (
                                        <button
                                            key={variant.id}
                                            onClick={() => {
                                                router.push(
                                                    `/product/${product.id.toString()}/${variant.external_id.toString()}`
                                                );
                                            }}
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
