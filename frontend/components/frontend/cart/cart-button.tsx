"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { CartDrawer } from "./CartDrawer";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

export function CartButton() {
    const locale = useLocale();
    const { data } = useCart({
        locale: locale
    });
    const [open, setOpen] = useState(false);

    const itemsCount =
        data?.items?.reduce(
            (sum, item) => sum + item.quantity,
            0
        ) ?? 0;
    return (
        <>
            <Button
                variant="outline"
                size="icon"
                className={cn("relative w-12",
                    itemsCount > 0
                        ? "border-green-500 text-green-600 hover:border-green-600 hover:bg-green-50"
                        : "border-gray-500 text-gray-600 hover:border-gray-600 hover:bg-gray-50"
                )}

                onClick={() => setOpen(true)}
            >
                <ShoppingCart className={cn(
                    itemsCount > 0
                        ? "!h-5 !w-5"
                        : "!h-4 !w-4"
                )} />

                {itemsCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs text-primary-foreground">
                        {itemsCount}
                    </span>
                )}

            </Button>
            <CartDrawer
                open={open}
                onOpenChange={setOpen}
            />
        </>
    );
}
