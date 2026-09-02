"use client";

import { CartItemPayload } from "@/types/cart";
import { CartItemsDrawer } from "../cart/CartItemsDrawer";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";

export function OrderItems({ items }: {items: CartItemPayload[]}) {
    const t = useTranslations('frontend')
    return (
        <div>
            <h2 className="mb-4 text-xl font-semibold">{t('checkout.your_order')}</h2>

            <Separator className="mb-4" />

            <div className="max-h-[500px] overflow-hidden">
                <CartItemsDrawer items={items} />
            </div>
        </div>
    );
}
