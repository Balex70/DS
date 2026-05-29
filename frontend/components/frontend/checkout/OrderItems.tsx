"use client";

import { CartItemPayload } from "@/types/cart";
import { CartItemsDrawer } from "../product/CartItemsDrawer";
import { Separator } from "@/components/ui/separator";

export function OrderItems({ items }: {items: CartItemPayload[]}) {
    return (
        <div>
            <h2 className="mb-4 text-xl font-semibold">Your order</h2>

            <Separator className="mb-4" />

            <div className="max-h-[500px] overflow-hidden">
                <CartItemsDrawer items={items} />
            </div>
        </div>
    );
}
