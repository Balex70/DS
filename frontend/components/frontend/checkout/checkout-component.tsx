"use client";

import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useCreateOrder } from "@/hooks/use-create-order";

import { ShippingForm } from "./ShippingForm";
import { OrderItems } from "./OrderItems";
import { OrderSummary } from "./OrderSummary";
import { ShippingMethod } from "@/types/shipping";
import { AvailableGatewayResponse, PaymentResponse } from "@/types/payment";
import { PaymentInfo } from "./PaymentInfo";
import { CheckoutStatus, Order, OrderPayload } from "@/types/order";
import { useCreatePayment } from "@/hooks/use-create-payment";
import { useAvailableGateway } from "@/hooks/use-available-gateway";
import { CheckoutDialog } from "./CheckoutDialog";
import { SendToPaymentGateway } from "./SendToPaymentGateway";
import { useLocale, useTranslations } from "next-intl";
import { detectCountry } from "@/helpers/geo";
import { useCurrency } from "@/context/CurrencyContext";
import { CartItemPayload } from "@/types/cart";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export function CheckoutComponent() {
    const locale = useLocale();
    const { currency } = useCurrency();
    const t = useTranslations('frontend')
    const { data: cart, isLoading } = useCart({
        locale: locale,
        currency: currency
    });
    const { mutate: createOrder } = useCreateOrder();
    const { mutate: createPayment } = useCreatePayment();
    const [shippingMethod, setShippingMethod] = useState<ShippingMethod | undefined>(undefined);
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [checkoutStatus, setCheckoutStatus] = useState<CheckoutStatus>("idle");
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [shippingFormValid, setShippingFormValid] = useState<boolean>(false);

    const items = cart?.items ?? [];

    const cartKey = cart?.items
        ?.map(i => `${i.product_id}:${i.quantity}`)
        .sort()
        .join("|");

    const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    function hasCurrencyPrice(
        item: CartItemPayload
    ): item is CartItemPayload {
        return item.currency_price !== undefined;
    }
    let currencySubtotal: number | undefined;
    if (currency !== "USD") {
        currencySubtotal =
            items.every(hasCurrencyPrice)
                ? items.reduce(
                    (sum, item) => sum + (item.currency_price ?? 0) * item.quantity,
                    0
                )
                : undefined;
    }

    const [form, setForm] = useState<OrderPayload>({
        shipping_full_name: "",
        shipping_phone: "",
        shipping_email: "",
        shipping_address_line1: "",
        shipping_address_line2: "",
        shipping_city: "",
        shipping_state: "",
        shipping_postal_code: "",
        shipping_country: detectCountry(),
        notes: "",
    });

    const { data: gateway } = useAvailableGateway(
        form.shipping_country,
        "USD"
    );

    function proceedWithPayment(order: Order, gateway: AvailableGatewayResponse){
        if (!gateway) {
            setCheckoutStatus("failed");
            return;
        }
        setCheckoutStatus("creating-payment");
        createPayment(
            {
                orderId: order.id,
                payment_method: gateway?.gateway,
                locale: locale,
            },
            {
                onSuccess: (paymentResponse: PaymentResponse) => {
                    if (!paymentResponse.redirect_url) {
                        setCheckoutStatus("failed");
                        return;
                    }

                    setCheckoutStatus("redirecting");
                    SendToPaymentGateway(gateway, paymentResponse);
                },
                onError: () => {
                    setCheckoutStatus("failed");
                },
            }
        );
    }

    function handleSubmit() {
        setCheckoutStatus("creating-order");
        createOrder(
            {
                ...form,
                shipping_cost: shippingMethod?.price,
                shipping_method: shippingMethod?.id,
                payment_method: gateway?.gateway,
                currency: "USD",
            },
            {
                onSuccess: (orderResponse) => {
                    const order: Order = orderResponse;
                    setCheckoutOpen(true);
                    proceedWithPayment(order, gateway);
                },
                onError: (error) => {
                    const status = error.response?.status;

                    if (status === 422 && error.response?.data?.errors) {
                        setErrors(error.response.data.errors);
                        setCheckoutStatus("idle");
                        setCheckoutOpen(false);
                        return;
                    }
                    setCheckoutStatus("failed");
                },
            }
        );
    }

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="space-y-4 animate-pulse">
                        <div className="h-4 w-3/4 rounded bg-muted" />
                        <div className="h-3 w-1/2 rounded bg-muted" />
                    </div>
                    <div className="space-y-4 animate-pulse">
                        <div className="h-4 w-3/4 rounded bg-muted" />
                        <div className="h-3 w-1/2 rounded bg-muted" />
                    </div>
                    <p className="mt-2 animate-pulse text-left text-xs text-muted-foreground">
                        {t('loading_loader')}
                    </p>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-w-0 flex-1">
                <Card className="mx-auto w-full max-w-5xl overflow-hidden border-border/60 bg-background shadow-sm">
                    <CardContent className="flex min-h-[360px] flex-col items-center justify-center px-6 py-12 text-center">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                            <AlertCircle className="h-10 w-10 text-muted-foreground" />
                        </div>

                        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                            {t('checkout.cart_is_empty')}
                        </h2>

                        <Button
                            className="mt-6"
                            variant="outline"
                            asChild
                        >
                            <Link href="/">
                                {t('to_home_button')}
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container py-0 lg:py-10">
            <h1 className="mb-6 text-3xl font-bold">{t('checkout.header')}</h1>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                {/* LEFT */}
                <ShippingForm
                    form={form}
                    setForm={setForm}
                    setCheckoutStatus={setCheckoutStatus}
                    shippingMethod={shippingMethod}
                    setShippingMethod={setShippingMethod}
                    cartKey={cartKey}
                    errors={errors}
                    setShippingFormValid={setShippingFormValid}
                    />

                {/* RIGHT */}
                <div className="space-y-6">
                    <OrderItems items={items} />

                    <PaymentInfo gateway={gateway} isLoading={isLoading} />

                    <OrderSummary
                        form={form}
                        shippingFormValid={shippingFormValid}
                        country={form.shipping_country}
                        subtotal={subtotal}
                        currencySubtotal={currencySubtotal}
                        shippingMethod={shippingMethod}
                        gateway={gateway}
                        checkoutStatus={checkoutStatus}
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>

            <CheckoutDialog checkoutOpen={checkoutOpen} setCheckoutOpen={setCheckoutOpen} checkoutStatus={checkoutStatus} />
        </div>
    );
}
