"use client";

import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useCreateOrder } from "@/hooks/use-create-order";

import { ShippingForm } from "./ShippingForm";
import { OrderItems } from "./OrderItems";
import { OrderSummary } from "./OrderSummary";
import { ShippingMethod } from "@/types/shipping";
import { PaymentMethods, PaymentResponse } from "@/types/payment";
import { PaymentSelector } from "./PaymentSelector";
import { Order } from "@/types/order";
import { useCreatePayment } from "@/hooks/use-create-payment";

export function CheckoutComponent() {
    const { data: cart, isLoading } = useCart();
    const { mutate: createOrder, isPending } = useCreateOrder();
    const { mutate: createPayment } = useCreatePayment();
    const [shippingMethod, setShippingMethod] = useState<ShippingMethod | undefined>(undefined);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethods>("stripe");

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

    function handleSubmit() {
        createOrder(
            {
                ...form,
                shipping_cost: shippingMethod?.price,
                shipping_method: shippingMethod?.id,
                payment_method: paymentMethod,
                currency: "USD",
            },
            {
                onSuccess: (orderResponse) => {
                    const order: Order = orderResponse;

                    createPayment(
                        {
                            orderId: order.id,
                            payment_method: paymentMethod,
                        },
                        {
                            onSuccess: (paymentResponse: PaymentResponse) => {
                                console.log('paymentResponse');
                                console.log(paymentResponse);
                                // window.location.href = paymentResponse.redirect_url !== undefined ? paymentResponse.redirect_url : "";
                            },
                            onError: () => {
                                alert("Payment init failed");
                            },
                        }
                    );
                },
                onError: () => {
                    alert("Something went wrong");
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
                <ShippingForm form={form} setForm={setForm} shippingMethod={shippingMethod} setShippingMethod={setShippingMethod} cartKey={cartKey} />

                {/* RIGHT */}
                <div className="space-y-6">
                    <OrderItems items={items} />

                    <PaymentSelector shippingMethod={shippingMethod} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />

                    <OrderSummary
                        subtotal={subtotal}
                        shippingMethod={shippingMethod}
                        isPending={isPending}
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
}
