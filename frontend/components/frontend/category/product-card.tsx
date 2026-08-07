"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/types/product";
import ProductImage from "./ProductImage";
import { Link } from "@/i18n/navigation";
import { useAddToCart } from "@/hooks/use-add-to-cart";
import { PriceRenderer } from "@/components/custom/PriceRenderer";
import { useCurrency } from "@/context/CurrencyContext";

type Props = {
    product: Product;
};

export function ProductCard({ product }: Props) {
    const { mutate: addToCart, isPending } = useAddToCart();
    const { currency } = useCurrency();

    const cheapestVariantImage = product.cheapest_variant?.image?.original_url ?? product.big_image?.original_url ?? undefined;

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({
            product_id: product.cheapest_variant.id,
            vid: product.cheapest_variant.external_id,
            title: product.cheapest_variant.name ?? product.name_processed ?? product.name_raw,
            sku: product.cheapest_variant.sku,
            quantity: 1,
            price: product.cheapest_variant.price, // product.price,
            image: product.cheapest_variant.image?.original_url ?? undefined,
            product_weight: product.cheapest_variant.weight ?? undefined,
            packing_weight: product.packing_weight ?? undefined
        });
    };
    return (
        <Card className="overflow-hidden transition hover:shadow-md gap-2 pb-0 pt-0">
            <Link
                href={`/product/${product.id}`}
                className="group block"
            >
                <div className="relative aspect-square bg-muted">
                    {product.big_image?.url ? (
                        <ProductImage
                                src={`/storage/${cheapestVariantImage}`}
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

            <CardContent className="flex h-full flex-col p-3">
                <h3 className="line-clamp-2 text-sm font-medium">
                    {product.translation ? product.translation?.name : product.name_processed ? product.name_processed : product.name_raw}
                </h3>

                <div className="mt-auto space-y-2">
                    <div className="text-lg font-semibold">
                        <PriceRenderer value={product.price} />
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

                    <button
                        onClick={handleAddToCart}
                        disabled={isPending}
                        className="rounded-md bg-black px-4 py-2 text-white hover:opacity-90 disabled:opacity-50"
                    >
                        {isPending ? "Adding..." : "Add to cart"}
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}
