"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useAddToCart } from "@/hooks/use-add-to-cart";
import { stockUpdate } from "@/services/product-variant-service";
import { Product, ProductVariant } from "@/types/product";

type ProductStockControlsProps = {
    product: Product;
    selectedVariant: ProductVariant;
    title: string;
};

export function ProductControls({
    product,
    selectedVariant,
    title,
}: ProductStockControlsProps) {
    const t = useTranslations("frontend");
    const { mutate: addToCart, isPending } = useAddToCart();

    const [stock, setStock] = useState(selectedVariant.stock);
    const [isStockUpdating, setIsStockUpdating] = useState(
        selectedVariant.stock_needs_update
    );

    const stockUpdateInProgress = useRef(false);

    useEffect(() => {
        if (
            !selectedVariant.stock_needs_update ||
            stockUpdateInProgress.current
        ) {
            return;
        }

        const updateStock = async () => {
            stockUpdateInProgress.current = true;
            setIsStockUpdating(true);

            try {
                const data = await stockUpdate(selectedVariant.id);
                setStock(data.stock);
            } catch {
                // Keep the existing stock value if the update fails.
            } finally {
                stockUpdateInProgress.current = false;
                setIsStockUpdating(false);
            }
        };

        updateStock();
    }, [selectedVariant.id, selectedVariant.stock_needs_update]);

    const handleAddToCart = () => {
        addToCart({
            product_variant_id: selectedVariant.id,
            vid: selectedVariant.external_id,
            title,
            sku: selectedVariant.sku,
            quantity: 1,
            price: selectedVariant.price,
            image: selectedVariant.image?.original_url ?? product.big_image?.original_url ?? undefined,
            product_weight: selectedVariant.weight ?? undefined,
            packing_weight: product.packing_weight ?? undefined,
        });
    };

    return (
        <>
            <div className="flex items-center mt-2">
                {isStockUpdating ? (
                    <Badge
                        variant="outline"
                        className="min-h-7 gap-1.5 border-amber-600/20 bg-amber-50/50 px-2.5 py-1 text-sm text-amber-700/70"
                    >
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        {t("product.availability.checking")}
                    </Badge>
                ) : stock === null ? (
                    <Badge
                        variant="outline"
                        className="min-h-7 px-2.5 py-1 text-sm text-muted-foreground"
                    >
                        {t("product.availability.unknown")}
                    </Badge>
                ) : stock === 0 ? (
                    <Badge
                        variant="outline"
                        className="min-h-7 border-red-600/20 bg-red-50/50 px-2.5 py-1 text-sm text-red-700/60"
                    >
                        {t("product.availability.out_of_stock")}
                    </Badge>
                ) : stock <= 10 ? (
                    <Badge
                        variant="outline"
                        className="min-h-7 border-amber-600/20 bg-amber-50/50 px-2.5 py-1 text-sm text-amber-700/70"
                    >
                        {t("product.availability.only_left", { count: stock })}
                    </Badge>
                ) : (
                    <Badge
                        variant="outline"
                        className="min-h-7 border-green-600/70 bg-green-50/50 px-2.5 py-2 text-sm text-green-700"
                    >
                        {t("product.availability.in_stock")}
                    </Badge>
                )}
            </div>
            <div className="flex gap-3 pt-4">
                <button
                    onClick={handleAddToCart}
                    disabled={isPending || isStockUpdating || stock === 0}
                    className="rounded-md bg-green-600 px-4 py-2 text-white hover:opacity-90 disabled:opacity-50"
                >
                    {isPending
                        ? t("product.adding")
                        : t("product.add_to_cart")}
                </button>
            </div>
        </>
    );
}
