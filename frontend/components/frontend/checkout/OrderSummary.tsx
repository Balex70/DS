"use client";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PriceRenderer } from "@/components/custom/PriceRenderer";

type Props = {
    subtotal: number;
    shippingCost?: number;
    isPending: boolean;
    onSubmit: () => void;
};

export function OrderSummary({
    subtotal,
    shippingCost = 0,
    isPending,
    onSubmit,
}: Props) {
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
                disabled={isPending}
            >
                {isPending ? "Creating order..." : "Create order"}
            </Button>
        </div>
    );
}
