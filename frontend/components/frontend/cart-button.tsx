"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart } from "lucide-react";

export function CartButton() {
    const { data } = useCart();

    const itemsCount =
        data?.items?.reduce(
            (sum, item) => sum + item.quantity,
            0
        ) ?? 0;
    return (
        <Button
            variant="outline"
            size="icon"
            className="relative"
        >
            <ShoppingCart className="h-5 w-5" />

            {itemsCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {itemsCount}
                </span>
            )}
        </Button>
    );
}
