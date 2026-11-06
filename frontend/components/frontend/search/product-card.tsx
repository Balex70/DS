"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/types/product";
import { Link } from "@/i18n/navigation";
import { PriceRenderer } from "@/components/custom/PriceRenderer";
import { useCurrency } from "@/context/CurrencyContext";
import { useLocale, useTranslations } from "next-intl";
import { ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ProductImage from "../product/ProductImage";

type Props = {
    product: Product;
};

export function SearchProductCard({ product }: Props) {
    const locale = useLocale();
    const { currency } = useCurrency();
    const t = useTranslations('frontend')
    const productImage = product.big_image?.original_url ?? undefined;
    const cheapestVariantId = product?.cheapest_variant?.external_id ?? '';
    const cheapestPrice = product?.cheapest_variant?.price ?? product.price;
    const getMaterialName = (material: Product['materials'][number]) => {
        return (
            material.translations?.find(
                (translation) => translation.locale === locale
            )?.name ?? material.name
        );
    };

    return (
        <Card className="overflow-hidden transition hover:shadow-md gap-2 pb-0 pt-0">
            <Link
                href={`/product/${product.id}/${cheapestVariantId}`}
                className="group block"
            >
                <div className="relative aspect-square bg-muted">
                    {productImage ? (
                        <ProductImage
                                src={`/storage/${productImage}`}
                                alt={product.name_processed ? product.name_processed : product.name_raw}
                                imageClassName="object-cover transition duration-300 group-hover:scale-105"
                            />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted/50">
                            <ImageOff
                                className="h-12 w-12 text-muted-foreground/40"
                                strokeWidth={1.5}
                            />
                        </div>
                    )}
                </div>
            </Link>

            <CardContent className="flex h-full flex-col p-3">
                <h3 className="line-clamp-2 text-sm font-medium">
                    {product.translation ? product.translation?.name : product.name_processed ? product.name_processed : product.name_raw}
                </h3>

                <div className="mt-auto space-y-2">
                    <div className="text-lg font-semibold text-red-500">
                        <PriceRenderer value={cheapestPrice} />
                        {(currency !== "USD" && product.currency_price) && (
                            <div className="text-sm font-normal text-muted-foreground">
                                (
                                <PriceRenderer
                                    value={product.currency_price}
                                    currency={currency}
                                />
                                )
                            </div>
                        )}
                    </div>
                    <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                        <span className="shrink-0">{t('category.product_card.materials')}:</span>
                        {product.materials?.map((material) => (
                            <>
                                <Badge
                                    key={material.id}
                                    variant="outline"
                                    className="h-5 px-1.5 py-0 text-xs font-normal text-slate-700 border-slate-200 bg-slate-50"
                                >
                                    {(getMaterialName(material)).trim().toLocaleLowerCase().replace(/^./u, (char) => char.toLocaleUpperCase())}
                                </Badge>
                            </>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
