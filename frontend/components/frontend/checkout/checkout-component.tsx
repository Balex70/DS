"use client";

import { useState } from "react";
import { useCart } from "@/hooks/use-cart";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
// import { Textarea } from "@/components/ui/textarea";
import { CartItemsDrawer } from "../product/CartItemsDrawer";
import { useCreateOrder } from "@/hooks/use-create-order";
import { PriceRenderer } from "@/components/custom/PriceRenderer";

export function CheckoutComponent() {
    const { data: cart, isLoading } = useCart();
    const { mutate: createOrder, isPending } = useCreateOrder();

    const items = cart?.items ?? [];

    const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const [loading, setLoading] = useState(false);

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
            onSuccess: (order) => {
                console.log(order);

                alert("Order created!");
            },

            onError: (error) => {
                console.error(error);

                alert("Something went wrong");
            },
        });
    }

    if (isLoading) {
        return (
            <div className="container py-10">
                Loading...
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="container py-10">
                <h1 className="text-2xl font-semibold">
                    Your cart is empty
                </h1>
            </div>
        );
    }

    return (
        <div className="container py-10">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                {/* LEFT */}
                <div>
                    <h1 className="mb-6 text-3xl font-bold">
                        Checkout
                    </h1>

                    <div className="space-y-4">
                        <Input
                            placeholder="Full name"
                            value={form.shipping_full_name}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    shipping_full_name: e.target.value,
                                })
                            }
                        />

                        <Input
                            placeholder="Phone"
                            value={form.shipping_phone}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    shipping_phone: e.target.value,
                                })
                            }
                        />

                        <Input
                            placeholder="Email"
                            type="email"
                            value={form.shipping_email}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    shipping_email: e.target.value,
                                })
                            }
                        />

                        <Input
                            placeholder="Address line 1"
                            value={form.shipping_address_line1}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    shipping_address_line1: e.target.value,
                                })
                            }
                        />

                        <Input
                            placeholder="Address line 2"
                            value={form.shipping_address_line2}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    shipping_address_line2: e.target.value,
                                })
                            }
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                placeholder="City"
                                value={form.shipping_city}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        shipping_city: e.target.value,
                                    })
                                }
                            />

                            <Input
                                placeholder="State"
                                value={form.shipping_state}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        shipping_state: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                placeholder="Postal code"
                                value={form.shipping_postal_code}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        shipping_postal_code: e.target.value,
                                    })
                                }
                            />

                            <Input
                                placeholder="Country"
                                value={form.shipping_country}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        shipping_country: e.target.value,
                                    })
                                }
                            />
                        </div>

                        {/* <Textarea
                            placeholder="Notes"
                            value={form.notes}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    notes: e.target.value,
                                })
                            }
                        /> */}
                    </div>
                </div>

                {/* RIGHT */}
                <div>
                    <div className="rounded-xl border p-4">
                        <h2 className="mb-4 text-xl font-semibold">
                            Your order
                        </h2>

                        <Separator className="mb-4" />

                        <div className="max-h-[500px] overflow-hidden">
                            <CartItemsDrawer items={items} />
                        </div>

                        <Separator className="my-4" />

                        <div className="flex items-center justify-between text-lg font-semibold">
                            <span>Total</span>

                            <span>
                                <PriceRenderer value={subtotal} />
                            </span>
                        </div>

                        <Button
                            className="mt-6 w-full"
                            onClick={handleSubmit}
                            disabled={isPending}
                        >
                            {isPending
                                ? "Creating order..."
                                : "Create order"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
