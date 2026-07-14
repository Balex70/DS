"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { CartDrawer } from "./CartDrawer";
import { useLocale } from "next-intl";

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
                className="relative"
                onClick={() => setOpen(true)}
            >
                <ShoppingCart className="h-5 w-5" />

                {itemsCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
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
