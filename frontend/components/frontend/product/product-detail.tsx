"use client";

import ProductGallery from "./ProductGallery";
import { PriceRenderer } from "@/components/custom/PriceRenderer";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from 'next-intl';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MobileVariantSelector from "./mobile-variant-selector";
import { Product, ProductVariant } from "@/types/product";
import { CurrencyCode } from "@/types/currency";
import { useRouter } from "@/i18n/navigation";
import { ProductControls } from "./ProductControls";

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
    const locale = useLocale();
    const t = useTranslations('frontend')
    const router = useRouter();
    const activeVariantId = selectedVariant?.id;
    const galleryMainImage = selectedVariant?.image ?? product.big_image;
    const variantTranslation = selectedVariant?.translations.find((item) => item.locale === locale);

    const title = variantTranslation?.name ?? selectedVariant.name_processed ?? selectedVariant.name ?? product.name_processed ?? product.name_raw;

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

                <div className="text-3xl font-bold flex-col text-red-500">
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

                <ProductControls
                    product={product}
                    selectedVariant={selectedVariant}
                    title={title}
                />

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
