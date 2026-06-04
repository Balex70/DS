"use client";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PriceRenderer } from "@/components/custom/PriceRenderer";
import { ShippingMethod } from "@/types/shipping";
import { AvailableGatewayResponse } from "@/types/payment";

type Props = {
    country?: string;
    subtotal: number;
    shippingMethod?: ShippingMethod,
    isPending: boolean;
    gateway: AvailableGatewayResponse;
    onSubmit: () => void;
};

export function OrderSummary({
    country,
    subtotal,
    shippingMethod,
    isPending,
    gateway,
    onSubmit,
}: Props) {
    const shippingCost = shippingMethod?.price ?? 0;
    const total = subtotal + shippingCost;

    const isLoading = isPending;
    const hasCountry = !!country;
    const noShipping = !shippingMethod;
    const noGateway = shippingMethod && !gateway;

    let buttonText = "Create order";
    if (isLoading) {
        buttonText = "Creating order...";
    } else if (!hasCountry) {
        buttonText = "Select delivery country";
    } else if (noShipping) {
        buttonText = "Select shipping method";
    } else if (noGateway) {
        buttonText = "Payments not available in this region";
    }

    return (
        <div className="rounded-xl border p-4">
            <h2 className="mb-4 text-xl font-semibold">Summary</h2>

            <Separator className="mb-4" />

            <div className="flex justify-between">
                <span>Subtotal</span>
                <PriceRenderer value={subtotal} />
            </div>

            <div className="flex justify-between">
                <span>Shipping {shippingMethod && `(${shippingMethod.name})`}</span>
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
                disabled={isLoading || noShipping || noGateway}
            >
                {buttonText}
            </Button>
            {hasCountry && noShipping && (
                <p className="text-sm text-red-500 mt-2">
                    Please select a shipping method.
                </p>
            )}
            {noGateway && (
                <p className="text-sm text-red-500 mt-2">
                    Unfortunately, we don’t support payments in this region yet.
                </p>
            )}
        </div>
    );
}
