"use client";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PriceRenderer } from "@/components/custom/PriceRenderer";
import { ShippingMethod } from "@/types/shipping";
import { AvailableGatewayResponse } from "@/types/payment";
import { CheckoutStatus, OrderPayload } from "@/types/order";
import { useCurrency } from "@/context/CurrencyContext";
import { COUNTRIES } from "@/config/countries";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";

type Props = {
    form: OrderPayload;
    shippingFormValid: boolean;
    country?: string;
    subtotal: number;
    currencySubtotal?: number;
    shippingMethod?: ShippingMethod,
    gateway: AvailableGatewayResponse;
    checkoutStatus: CheckoutStatus;
    onSubmit: () => void;
};

export function OrderSummary({
    form,
    shippingFormValid,
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
    } else if (!shippingFormValid) {
        buttonText = "Shipping form is not valid";
    }

    const isDisabled =
        checkoutStatus === "creating-order" ||
        checkoutStatus === "creating-payment" ||
        checkoutStatus === "redirecting" ||
        noShipping ||
        noGateway ||
        !shippingFormValid ||
        !hasCountry;

    const countryName = COUNTRIES.find((c) => c.code === country)?.name || country;

    const goToShippingForm = () => {
        const form = document.getElementById("checkout-shipping-form");
        form?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });

        document.getElementById("shipping_full_name_latin")?.focus();
    };

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
                <div className="flex flex-wrap">
                    <span>Shipping</span>
                    {shippingMethod &&
                        <span>({shippingMethod.name})</span>
                    }
                </div>
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
            <div className="mt-2 flex justify-between">
                { !isDisabled &&
                    <div className="space-y-1 text-sm text-muted-foreground">
                        <h3 className="mb-2 font-medium">Shipping details:</h3>
                        <div className="flex flex-wrap items-baseline gap-1">
                            <span className="text-xs text-muted-foreground">Full Name:</span>
                            <span className="text-sm font-semibold">{form.shipping_full_name_latin}</span>
                        </div>
                        {form.shipping_phone && (
                            <div className="flex flex-wrap items-baseline gap-1">
                                <span className="text-xs text-muted-foreground">Phone:</span>
                                <span className="text-sm font-semibold">{form.shipping_phone}</span>
                            </div>
                        )}
                        <div className="flex flex-wrap items-baseline gap-1">
                            <span className="text-xs text-muted-foreground">Email:</span>
                            <span className="text-sm font-semibold">{form.shipping_email}</span>
                        </div>
                        <div className="flex flex-wrap items-baseline gap-1">
                            <span className="text-xs text-muted-foreground">Address:</span>
                            <span className="text-sm font-semibold">{form.shipping_address_line1_latin}</span>
                        </div>
                        {form.shipping_address_line2_latin && (
                            <div className="flex flex-wrap items-baseline gap-1">
                                <span className="text-xs text-muted-foreground">Address (additional):</span>
                                <span className="text-sm font-semibold">{form.shipping_address_line2_latin}</span>
                            </div>
                        )}
                        <div className="flex flex-wrap items-baseline gap-1">
                            <span className="text-xs text-muted-foreground">City:</span>
                            <span className="text-sm font-semibold">{form.shipping_city_latin}</span>
                        </div>
                        {form.shipping_state_latin && (
                            <div className="flex flex-wrap items-baseline gap-1">
                                <span className="text-xs text-muted-foreground">State:</span>
                                <span className="text-sm font-semibold">{form.shipping_state_latin}</span>
                            </div>
                        )}
                        {form.shipping_postal_code && (
                            <div className="flex flex-wrap items-baseline gap-1">
                                <span className="text-xs text-muted-foreground">Postal Code:</span>
                                <span className="text-sm font-semibold">{form.shipping_postal_code}</span>
                            </div>
                        )}
                        <div className="flex flex-wrap items-baseline gap-1">
                            <span className="text-xs text-muted-foreground">Country:</span>
                            <span className="text-sm font-semibold">{countryName}</span>
                        </div>

                        <Alert className="mt-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
                            <TriangleAlert className="h-4 w-4" />

                            <AlertTitle>Please review your shipping details</AlertTitle>

                            <AlertDescription className="space-y-3">
                                <p>
                                    Please make sure your shipping information is correct and written in
                                    Latin characters. Incorrect information may delay delivery or cause
                                    your package to be returned.
                                </p>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={goToShippingForm}
                                >
                                    Edit shipping details
                                </Button>
                            </AlertDescription>
                        </Alert>
                    </div>
                }
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
