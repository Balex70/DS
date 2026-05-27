"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import ProductImage from "./ProductImage";
import Image from 'next/image'
import { useRemoveFromCart } from "@/hooks/use-remove-from-cart";
import { Trash2 } from "lucide-react";
import { useUpdateCartItem } from "@/hooks/use-update-cart-item";
import { CartItemPayload } from "@/types/cart";
import { PriceRenderer } from "@/components/custom/PriceRenderer";

type Props = {
    items: CartItemPayload[];
};

export function CartItemsDrawer({items}: Props) {
    const { mutate: removeItem, isPending: isRemovePending } = useRemoveFromCart();
    const { mutate: updateQty } = useUpdateCartItem();

    return (
        <ScrollArea className="flex-1 min-h-0 pr-2">
            <div className="space-y-4">
                {items.map((item, index) => (
                    <div
                        key={`${item.product_id}-${index}`}
                        className="group flex items-center gap-4 p-2 mb-1 rounded-md transition hover:bg-muted/30"
                    >
                        {/* IMAGE */}
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted transition-opacity group-hover:opacity-80">
                            {item.image ? (
                                <ProductImage
                                    src={item.image ?? ""}
                                    alt={item.title}
                                    imageClassName="object-cover"
                                />
                            ) : (
                                <Image
                                    src="/products/no_image.png"
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                />
                            )}
                        </div>

                        {/* INFO */}
                        <div className="flex flex-1 flex-col justify-center transition-opacity">
                            <p className="line-clamp-2 text-sm font-medium">
                                {item.title}
                            </p>

                            <div className="mt-1 flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                updateQty({
                                                    productId: item.product_id!,
                                                    quantity: Math.max(1, item.quantity - 1),
                                                })
                                            }
                                            className="h-7 w-7 rounded border text-sm hover:bg-red-50 hover:text-red-300"
                                        >
                                            -
                                        </button>

                                        <span className="w-6 text-center text-sm">
                                            {item.quantity}
                                        </span>

                                        <button
                                            onClick={() =>
                                                updateQty({
                                                    productId: item.product_id!,
                                                    quantity: item.quantity + 1,
                                                })
                                            }
                                            className="h-7 w-7 rounded border text-sm hover:bg-green-100 hover:text-green-600"
                                        >
                                            +
                                        </button>
                                    </div>
                                </span>

                                <span className="font-medium">
                                    <PriceRenderer value={item.price * item.quantity} />
                                </span>
                            </div>
                        </div>

                        {/* DELETE */}
                        <button
                            onClick={() => removeItem(item.product_id!)}
                            disabled={isRemovePending}
                            className="
                                ml-auto flex h-10 w-10 items-center justify-center
                                rounded-md text-muted-foreground
                                cursor-pointer transition
                                hover:bg-red-50 hover:text-red-600
                                group-hover:text-red-500
                                disabled:opacity-50 disabled:cursor-not-allowed
                            "
                        >
                            {isRemovePending ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                            ) : (
                                <Trash2 className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
}
