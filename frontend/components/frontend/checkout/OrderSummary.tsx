"use client";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PriceRenderer } from "@/components/custom/PriceRenderer";
import { ShippingMethod } from "@/types/shipping";

type Props = {
    subtotal: number;
    shippingMethod?: ShippingMethod,
    isPending: boolean;
    onSubmit: () => void;
};

export function OrderSummary({
    subtotal,
    shippingMethod,
    isPending,
    onSubmit,
}: Props) {
    const shippingCost = shippingMethod?.price ?? 0;
    const total = subtotal + shippingCost;

    return (
        <div className="rounded-xl border p-4">
            <h2 className="mb-4 text-xl font-semibold">Summary</h2>

            <Separator className="mb-4" />

            <div className="flex justify-between">
                <span>Subtotal</span>
                <PriceRenderer value={subtotal} />
            </div>

            <div className="flex justify-between">
                <span>Shipping</span>
                <PriceRenderer value={shippingCost} />
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <PriceRenderer value={total} />
            </div>

            <Button
                className="mt-6 w-full"
                onClick={onSubmit}
                disabled={isPending || !shippingMethod}
            >
                {isPending ? "Creating order..." : (isPending || !shippingMethod) ? "Select shipping method" : "Create order"}
            </Button>
        </div>
    );
}
