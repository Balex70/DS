"use client";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PriceRenderer } from "@/components/custom/PriceRenderer";
import { ShippingMethod } from "@/types/shipping";
import { AvailableGatewayResponse } from "@/types/payment";
import { CheckoutStatus } from "@/types/order";
import { useCurrency } from "@/context/CurrencyContext";

type Props = {
    country?: string;
    subtotal: number;
    currencySubtotal?: number;
    shippingMethod?: ShippingMethod,
    gateway: AvailableGatewayResponse;
    checkoutStatus: CheckoutStatus;
    onSubmit: () => void;
};

export function OrderSummary({
    country,
    subtotal,
    currencySubtotal,
    shippingMethod,
    gateway,
    checkoutStatus,
    onSubmit,
}: Props) {
    const { currency } = useCurrency();
    const shippingCost = shippingMethod?.price ?? 0;
    const total = subtotal + shippingCost;

    let currencyTotal: number | undefined = undefined;
    if(currencySubtotal !== undefined && shippingMethod?.currency_price !== undefined) {
        currencyTotal = currencySubtotal + shippingMethod?.currency_price
    }

    const hasCountry = !!country;
    const noShipping = !shippingMethod;
    const noGateway = !!shippingMethod && !gateway;

    let buttonText = "Proceed to Payment";

    if (checkoutStatus === "failed") {
        buttonText = "Payment Failed — Try Again";
    } else if (checkoutStatus === "creating-order") {
        buttonText = "Creating Order...";
    } else if (checkoutStatus === "creating-payment") {
        buttonText = "Preparing Payment...";
    } else if (checkoutStatus === "redirecting") {
        buttonText = "Redirecting...";
    } else if (!hasCountry) {
        buttonText = "Select Delivery Country";
    } else if (noShipping) {
        buttonText = "Select Shipping Method";
    } else if (noGateway) {
        buttonText = "Payments Not Available";
    }

    const isDisabled =
        checkoutStatus === "creating-order" ||
        checkoutStatus === "creating-payment" ||
        checkoutStatus === "redirecting" ||
        noShipping ||
        noGateway ||
        !hasCountry;

    return (
        <div className="rounded-xl border p-4">
            <h2 className="mb-4 text-xl font-semibold">Summary</h2>

            <Separator className="mb-4" />

            <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-sm">
                    <PriceRenderer value={subtotal} />
                    {currency !== "USD" && currencySubtotal !== undefined && (
                        <span className="ml-2 text-xs font-normal text-muted-foreground">
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

            <div className="flex justify-between">
                <span>Shipping {shippingMethod && `(${shippingMethod.name})`}</span>
                <span className="text-sm">
                    <PriceRenderer value={shippingCost} />
                    {shippingMethod?.currency_price !== undefined && (
                        <span className="ml-2 text-xs font-normal text-muted-foreground">
                            (
                            <PriceRenderer
                                value={shippingMethod?.currency_price}
                                currency={currency}
                            />
                            )
                        </span>
                    )}
                </span>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-sm">
                    <PriceRenderer value={total} />
                    {currency !== "USD" && currencyTotal !== undefined && (
                        <span className="ml-2 text-xs font-normal text-muted-foreground">
                            (
                            <PriceRenderer
                                value={currencyTotal}
                                currency={currency}
                            />
                            )
                        </span>
                    )}
                </span>
            </div>

            <Button
                className="mt-6 w-full"
                onClick={onSubmit}
                disabled={isDisabled}
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
