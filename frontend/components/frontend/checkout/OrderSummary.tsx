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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import ImportDutyDialog from "./ImportDutyDialog";
import { useTranslations } from "next-intl";

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
    const [importDutyDialogOpen, setImportDutyDialogOpen] = useState(false);
    const t = useTranslations('frontend')
    const shippingCost = shippingMethod?.price ?? 0;
    const total = subtotal + shippingCost;

    let currencyTotal: number | undefined = undefined;
    if(currencySubtotal !== undefined && shippingMethod?.currency_price !== undefined) {
        currencyTotal = currencySubtotal + shippingMethod?.currency_price
    }

    const hasCountry = !!country;
    const noShipping = !shippingMethod;
    const noGateway = !!shippingMethod && !gateway;

    let buttonText = t('checkout.order_summery.proceed_to_payment');

    if (checkoutStatus === "failed") {
        buttonText = t('checkout.order_summery.payment_failed');
    } else if (checkoutStatus === "creating-order") {
        buttonText = t('checkout.order_summery.creating_order');
    } else if (checkoutStatus === "creating-payment") {
        buttonText = t('checkout.order_summery.preparing_payment');
    } else if (checkoutStatus === "redirecting") {
        buttonText = t('checkout.order_summery.redirecting');
    } else if (!hasCountry) {
        buttonText = t('checkout.order_summery.select_delivery_country');
    } else if (noShipping) {
        buttonText = t('checkout.order_summery.select_shipping_method');
    } else if (noGateway) {
        buttonText = t('checkout.order_summery.payment_not_available');
    } else if (!shippingFormValid) {
        buttonText = t('checkout.order_summery.shipping_form_is_not_valid');
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

    function handleSubmit(){
        setImportDutyDialogOpen(true);
    }

    function handleImportDutyConfirm() {
        setImportDutyDialogOpen(false);
        onSubmit();
    }

    return (
        <>
            <div className="rounded-xl border p-4">
                <h2 className="mb-4 text-xl font-semibold">{t('checkout.order_summery.header')}</h2>

                <Separator className="mb-4" />

                <div className="flex justify-between">
                    <span>{t('checkout.order_summery.subtotal')}</span>
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
                        <span>{t('checkout.order_summery.shipping_price')}</span>
                        {shippingMethod &&
                            <span className="ml-1 font-normal text-muted-foreground ">({shippingMethod.name})</span>
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
                            <Card className="mt-2 gap-2 p-2">
                                <CardHeader className="pb-1 px-1">
                                    <CardTitle className="font-medium text-muted-foreground">
                                        {t('checkout.order_summery.shipping_details.header')}
                                    </CardTitle>
                                    <CardDescription>
                                        {t('checkout.order_summery.shipping_details.description')}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-2 px-1">
                                    <div className="flex flex-wrap items-baseline gap-1">
                                        <span className="text-xs text-muted-foreground">{t('checkout.shipping_info.full_name')}:</span>
                                        <span className="text-sm font-semibold">{form.shipping_full_name_latin}</span>
                                    </div>
                                    {form.shipping_phone && (
                                        <div className="flex flex-wrap items-baseline gap-1">
                                            <span className="text-xs text-muted-foreground">{t('checkout.shipping_info.phone')}:</span>
                                            <span className="text-sm font-semibold">{form.shipping_phone}</span>
                                        </div>
                                    )}
                                    <div className="flex flex-wrap items-baseline gap-1">
                                        <span className="text-xs text-muted-foreground">{t('checkout.shipping_info.email')}:</span>
                                        <span className="text-sm font-semibold">{form.shipping_email}</span>
                                    </div>
                                    <div className="flex flex-wrap items-baseline gap-1">
                                        <span className="text-xs text-muted-foreground">{t('checkout.shipping_info.address_line_1')}:</span>
                                        <span className="text-sm font-semibold">{form.shipping_address_line1_latin}</span>
                                    </div>
                                    {form.shipping_address_line2_latin && (
                                        <div className="flex flex-wrap items-baseline gap-1">
                                            <span className="text-xs text-muted-foreground">{t('checkout.shipping_info.address_line_2')}:</span>
                                            <span className="text-sm font-semibold">{form.shipping_address_line2_latin}</span>
                                        </div>
                                    )}
                                    <div className="flex flex-wrap items-baseline gap-1">
                                        <span className="text-xs text-muted-foreground">{t('checkout.shipping_info.city')}:</span>
                                        <span className="text-sm font-semibold">{form.shipping_city_latin}</span>
                                    </div>
                                    {form.shipping_state_latin && (
                                        <div className="flex flex-wrap items-baseline gap-1">
                                            <span className="text-xs text-muted-foreground">{t('checkout.shipping_info.state')}:</span>
                                            <span className="text-sm font-semibold">{form.shipping_state_latin}</span>
                                        </div>
                                    )}
                                    {form.shipping_postal_code && (
                                        <div className="flex flex-wrap items-baseline gap-1">
                                            <span className="text-xs text-muted-foreground">{t('checkout.shipping_info.postal_code')}:</span>
                                            <span className="text-sm font-semibold">{form.shipping_postal_code}</span>
                                        </div>
                                    )}
                                    <div className="flex flex-wrap items-baseline gap-1">
                                        <span className="text-xs text-muted-foreground">{t('checkout.shipping_info.country')}:</span>
                                        <span className="text-sm font-semibold">{countryName}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Alert className="mt-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
                                <TriangleAlert className="h-4 w-4 !text-yellow-500" />

                                <AlertTitle>{t('checkout.order_summery.shipping_details.alert_title')}</AlertTitle>

                                <AlertDescription className="space-y-3">
                                    <p>
                                        {t.rich('checkout.order_summery.shipping_details.alert_message', {
                                            strong: (chunks) => <strong className="font-semibold text-red-500">{chunks}</strong>
                                        })}
                                    </p>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={goToShippingForm}
                                    >
                                        {t('checkout.order_summery.shipping_details.edit_shipping_button')}
                                    </Button>
                                </AlertDescription>
                            </Alert>
                        </div>
                    }
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between text-lg font-semibold">
                    <span>{t('checkout.order_summery.total')}</span>
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
                    onClick={handleSubmit}
                    disabled={isDisabled}
                >
                    {buttonText}
                </Button>
                {hasCountry && noShipping && (
                    <p className="text-sm text-red-500 mt-2">
                        {t('checkout.order_summery.please_select_shipping_method')}
                    </p>
                )}
                {noGateway && (
                    <p className="text-sm text-red-500 mt-2">
                        {t('checkout.order_summery.payment_not_supported')}
                    </p>
                )}
            </div>

            <ImportDutyDialog open={importDutyDialogOpen} onOpenChange={setImportDutyDialogOpen} onConfirm={handleImportDutyConfirm} />
        </>
    );
}
