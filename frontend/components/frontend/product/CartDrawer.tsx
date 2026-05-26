"use client";

import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import ProductImage from "./ProductImage";
import Image from 'next/image'
import { useClearCart } from "@/hooks/use-clear-cart";
import { useRemoveFromCart } from "@/hooks/use-remove-from-cart";
import { Trash2 } from "lucide-react";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function CartDrawer({
    open,
    onOpenChange,
}: Props) {
    const { data: cart, isLoading } = useCart();
    const { mutate: clearCart, isPending } = useClearCart();
    const { mutate: removeItem, isPending: isRemovePending } = useRemoveFromCart();

    const items = cart?.items ?? [];

    const itemsCount = items.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="flex w-full flex-col sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>
                        Cart ({itemsCount})
                    </SheetTitle>
                </SheetHeader>

                <Separator className="my-0" />

                {/* CONTENT */}
                <div className="flex flex-1 min-h-0 flex-col overflow-hidden px-2">
                    {isLoading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-4"
                                >
                                    <div className="h-16 w-16 animate-pulse rounded-md bg-muted" />

                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                                        <div className="h-4 w-1/4 animate-pulse rounded bg-muted" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : items.length === 0 ? (
                        <div className="flex flex-1 items-center justify-center">
                            <div className="text-center">
                                <p className="text-lg font-medium">
                                    Your cart is empty
                                </p>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Add some products to continue shopping
                                </p>
                            </div>
                        </div>
                    ) : (
                        <ScrollArea className="flex-1 min-h-0 pr-4">
                            <div className="space-y-4">
                                {items.map((item, index) => (
                                    <div
                                        key={`${item.product_id}-${index}`}
                                        className="group flex items-center gap-4 rounded-md transition hover:bg-muted/30"
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
                                        <div className="flex flex-1 flex-col justify-center transition-opacity group-hover:opacity-80">
                                            <p className="line-clamp-2 text-sm font-medium">
                                                {item.title}
                                            </p>

                                            <div className="mt-1 flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">
                                                    Qty: {item.quantity}
                                                </span>

                                                <span className="font-medium">
                                                    ${(item.price * item.quantity).toFixed(2)}
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
                    )}
                </div>

                {/* FOOTER */}
                {items.length > 0 && (
                    <div className="border-t py-4 px-2">
                        <div className="mb-4 flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                                Subtotal
                            </span>

                            <span className="text-lg font-semibold">
                                ${subtotal.toFixed(2)}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <Button
                                asChild
                                className="w-full"
                            >
                                <Link href="/checkout">
                                    Checkout
                                </Link>
                            </Button>

                            <Button
                                asChild
                                variant="outline"
                                className="w-full"
                            >
                                <Link href="/cart">
                                    View Cart
                                </Link>
                            </Button>

                            <Button
                                variant="ghost"
                                className="w-full text-red-500 hover:text-red-600"
                                disabled={isPending}
                                onClick={() => clearCart()}
                            >
                                {isPending ? "Clearing..." : "Clear cart"}
                            </Button>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
