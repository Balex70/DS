"use client";

import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useCreateOrder } from "@/hooks/use-create-order";

import { ShippingForm } from "./ShippingForm";
import { OrderItems } from "./OrderItems";
import { OrderSummary } from "./OrderSummary";
import { ShippingMethod } from "@/types/shipping";

export function CheckoutComponent() {
    const { data: cart, isLoading } = useCart();
    const { mutate: createOrder, isPending } = useCreateOrder();
    const [shippingMethod, setShippingMethod] = useState<ShippingMethod | undefined>(undefined);

    const items = cart?.items ?? [];

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
        createOrder(form, {
            onSuccess: () => {
                alert("Order created!");
            },
            onError: () => {
                alert("Something went wrong");
            },
        });
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
                <ShippingForm form={form} setForm={setForm} shippingMethod={shippingMethod} setShippingMethod={setShippingMethod} />

                {/* RIGHT */}
                <div className="space-y-6">
                    <OrderItems items={items} />

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
