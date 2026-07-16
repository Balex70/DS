"use client";

import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { useClearCart } from "@/hooks/use-clear-cart";
import { CartItemsDrawer } from "./CartItemsDrawer";
import { PriceRenderer } from "@/components/custom/PriceRenderer";
import { useLocale } from "next-intl";
import { useCurrency } from "@/context/CurrencyContext";
import { CartItemPayload } from "@/types/cart";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function CartDrawer({
    open,
    onOpenChange,
}: Props) {
    const locale = useLocale();
    const { currency } = useCurrency();
    const { data: cart, isLoading } = useCart({
        locale: locale,
        currency: currency
    });
    const { mutate: clearCart, isPending } = useClearCart();

    const items = cart?.items ?? [];

    const itemsCount = items.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    // Calculate subtotal for currency price
    function hasCurrencyPrice(
        item: CartItemPayload
    ): item is CartItemPayload {
        return item.currency_price !== undefined;
    }
    let currencySubtotal: number | undefined;
    if (currency !== "USD") {
        currencySubtotal =
            items.every(hasCurrencyPrice)
                ? items.reduce(
                    (sum, item) => sum + (item.currency_price ?? 0) * item.quantity,
                    0
                )
                : undefined;
    }

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
                        <CartItemsDrawer items={items} />
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
                                <PriceRenderer value={subtotal} />
                                {currency !== "USD" && currencySubtotal !== undefined && (
                                    <span className="block text-xs font-normal text-muted-foreground">
                                        (
                                        <PriceRenderer
                                            value={currencySubtotal}
                                            currency={currency}
                                        />
                                        )
                                    </span>
                                )}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <Button
                                asChild
                                className="w-full"
                            >
                                <Link
                                    href="/checkout"
                                    onClick={() => onOpenChange(false)}
                                >
                                    Checkout
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
