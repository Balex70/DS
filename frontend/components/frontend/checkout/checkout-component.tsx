"use client";

import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useCreateOrder } from "@/hooks/use-create-order";

import { ShippingForm } from "./ShippingForm";
import { OrderItems } from "./OrderItems";
import { OrderSummary } from "./OrderSummary";
import { ShippingMethod } from "@/types/shipping";
import { PaymentResponse } from "@/types/payment";
import { PaymentInfo } from "./PaymentInfo";
import { CheckoutStatus, Order } from "@/types/order";
import { useCreatePayment } from "@/hooks/use-create-payment";
import { useAvailableGateway } from "@/hooks/use-available-gateway";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export function CheckoutComponent() {
    const { data: cart, isLoading } = useCart();
    const { mutate: createOrder } = useCreateOrder();
    const { mutate: createPayment } = useCreatePayment();
    const [shippingMethod, setShippingMethod] = useState<ShippingMethod | undefined>(undefined);
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [checkoutStatus, setCheckoutStatus] = useState<CheckoutStatus>("idle");

    const items = cart?.items ?? [];

    const cartKey = cart?.items
        ?.map(i => `${i.product_id}:${i.quantity}`)
        .sort()
        .join("|");

    const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const [form, setForm] = useState({
        shipping_full_name: "",
        shipping_phone: "",
        shipping_email: "",
        shipping_address_line1: "",
        shipping_address_line2: "",
        shipping_city: "",
        shipping_state: "",
        shipping_postal_code: "",
        shipping_country: "",
        notes: "",
    });

    const { data: gateway } = useAvailableGateway(
        form.shipping_country,
        "USD"
    );

    const handleFormChange = (newForm: typeof form) => {
        setForm(newForm);
        setCheckoutStatus("idle");
    };

    function handleSubmit() {
        setCheckoutOpen(true);
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
                    setCheckoutStatus("creating-payment");

                    createPayment(
                        {
                            orderId: order.id,
                            payment_method: gateway?.gateway,
                        },
                        {
                            onSuccess: (paymentResponse: PaymentResponse) => {
                                if (!paymentResponse.redirect_url) {
                                    setCheckoutStatus("failed");
                                    return;
                                }

                                setCheckoutStatus("redirecting");
                                window.location.href = paymentResponse.redirect_url;
                            },
                            onError: () => {
                                setCheckoutStatus("failed");
                            },
                        }
                    );
                },
                onError: () => {
                    setCheckoutStatus("failed");
                },
            }
        );
    }

    if (isLoading) return <div className="container py-10">Loading...</div>;

    if (items.length === 0) {
        return (
            <div className="container py-10">
                <h1 className="text-2xl font-semibold">Your cart is empty</h1>
            </div>
        );
    }

    return (
        <div className="container py-10">
            <h1 className="mb-6 text-3xl font-bold">Checkout</h1>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                {/* LEFT */}
                <ShippingForm form={form} setForm={handleFormChange} shippingMethod={shippingMethod} setShippingMethod={setShippingMethod} cartKey={cartKey} />

                {/* RIGHT */}
                <div className="space-y-6">
                    <OrderItems items={items} />

                    <PaymentInfo gateway={gateway} isLoading={isLoading} />

                    <OrderSummary
                        country={form.shipping_country}
                        subtotal={subtotal}
                        shippingMethod={shippingMethod}
                        isPending={isLoading}
                        gateway={gateway}
                        checkoutStatus={checkoutStatus}
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>

            <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Processing checkout</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        {checkoutStatus === "creating-order" && (
                            <p>Creating your order...</p>
                        )}

                        {checkoutStatus === "creating-payment" && (
                            <p>Preparing payment...</p>
                        )}

                        {checkoutStatus === "redirecting" && (
                            <p>Redirecting to payment provider...</p>
                        )}

                        {checkoutStatus === "failed" && (
                            <p className="text-red-500">
                                Payment failed. Please try again.
                            </p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
