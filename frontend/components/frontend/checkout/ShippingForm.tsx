"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useShippingCalculate } from "@/hooks/use-shipping-calculate";
import { ShippingMethod } from "@/types/shipping";
import { OrderPayload } from "@/types/order";

type Props = {
    form: OrderPayload;
    setForm: (form: OrderPayload) => void;

    shippingMethod: ShippingMethod | null;
    setShippingMethod: (method: ShippingMethod) => void;
};

export function ShippingForm({
    form,
    setForm,
    shippingMethod,
    setShippingMethod,
}: Props) {
    const [payload, setPayload] = useState<{
        shipping_country: string;
        shipping_postal_code?: string;
    } | null>(null);

    const { data: shippingOptions = [], isLoading } =
        useShippingCalculate(payload);

    // trigger shipping calculation when address changes
    useEffect(() => {
        if (!form.shipping_country) return;

        const timeout = setTimeout(() => {
            setPayload({
                shipping_country: form.shipping_country,
                shipping_postal_code: form.shipping_postal_code,
            });
        }, 500);

        return () => clearTimeout(timeout);
    }, [form.shipping_country, form.shipping_postal_code]);

    return (
        <div>
            {/* HEADER */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold">
                    Shipping information
                </h2>
                <p className="text-sm text-muted-foreground">
                    Enter your shipping details for delivery
                </p>
            </div>

            {/* FORM */}
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
            </div>

            {/* SHIPPING METHODS */}
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-3">
                    Shipping method
                </h3>

                {!form.shipping_country ? (
                    <p className="text-sm text-muted-foreground">
                        Enter country to see shipping options
                    </p>
                ) : isLoading ? (
                    <p className="text-sm text-muted-foreground">
                        Loading shipping methods...
                    </p>
                ) : (
                    <div className="space-y-2">
                        {shippingOptions?.map((method: ShippingMethod) => (
                            <button
                                key={method.id}
                                onClick={() => setShippingMethod(method)}
                                className={`w-full border rounded p-3 text-left flex justify-between ${
                                    shippingMethod?.id === method.id
                                        ? "border-black"
                                        : ""
                                }`}
                            >
                                <div>
                                    <div className="font-medium">
                                        {method.name}
                                    </div>

                                    {method.estimated_delivery && (
                                        <div className="text-sm text-muted-foreground">
                                            {method.estimated_delivery}
                                        </div>
                                    )}
                                </div>

                                <div className="font-semibold">
                                    ${method.price}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
