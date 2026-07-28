"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { useShippingCalculate } from "@/hooks/use-shipping-calculate";
import { ShippingMethod } from "@/types/shipping";
import { CheckoutStatus, OrderPayload } from "@/types/order";
import { ShippingMethodsSelector } from "./ShippingMethodsSelector";
import { FinalCarriers } from "./FinalCarriers";
import { useCurrency } from "@/context/CurrencyContext";
import { SelectCountryForm } from "./SelectCountryForm";
import MobileSelectCountryForm from "./MobileSelectCountryForm";
import { checkoutSchemaValidation, CheckoutValidationType } from "@/helpers/validators/checkout-schema-validation";
import { z } from "zod";
import { transliterate } from "transliteration";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

type Props = {
    form: OrderPayload;
    setForm: React.Dispatch<React.SetStateAction<OrderPayload>>;
    setCheckoutStatus: (status: CheckoutStatus) => void;
    shippingMethod: ShippingMethod | undefined;
    setShippingMethod: (method: ShippingMethod | undefined) => void;
    cartKey: string | undefined;
    errors: Record<string, string[]>;
    setShippingFormValid: React.Dispatch<React.SetStateAction<boolean>>
};

export function ShippingForm({
    form,
    setForm,
    setCheckoutStatus,
    shippingMethod,
    setShippingMethod,
    cartKey,
    errors,
    setShippingFormValid
}: Props) {
    const [payload, setPayload] = useState<{
        shipping_country: string;
        shipping_postal_code?: string;
    } | null>(null);
    const { currency } = useCurrency();
    const { data: shippingOptions = [], isLoading, isFetching } =  useShippingCalculate(payload, cartKey, currency);

    const feValidationResult = checkoutSchemaValidation.safeParse(form);
    const feErrors = feValidationResult.success
        ? {}
        : z.flattenError(feValidationResult.error).fieldErrors;
    const getFieldError = (field: keyof OrderPayload) => feErrors[field as keyof CheckoutValidationType]?.[0] ?? errors[field]?.[0];

    const isFormValid = useMemo(() => {
        return checkoutSchemaValidation.safeParse(form).success;
    }, [form]);

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

    // reset shipping method when shipping options change (e.g. country changed, cart items changed, cart item deleted)
    useEffect(() => {
        if (!shippingOptions.length) {
            setShippingMethod(undefined);
            return;
        }

        const updated = shippingOptions.find(
            m => m.id === shippingMethod?.id
        );

        // if current method is still valid keep it but set to trigger re-render
        if (updated) {
            setShippingMethod(updated);
            return;
        }

        setShippingMethod(shippingOptions[0]);
    }, [shippingOptions, shippingMethod, setShippingMethod]);

    useEffect(() => {
        setShippingFormValid(isFormValid);
    }, [isFormValid, setShippingFormValid]);

    const latinFields = {
        shipping_full_name: "shipping_full_name_latin",
        shipping_address_line1: "shipping_address_line1_latin",
        shipping_address_line2: "shipping_address_line2_latin",
        shipping_city: "shipping_city_latin",
        shipping_state: "shipping_state_latin",
    } as const;

    const onFieldChange = <K extends keyof OrderPayload>(field: K, value: OrderPayload[K]) => {
        setForm(prev => {
            const next = {
                ...prev,
                [field]: value,
            };

            const latinField = latinFields[field as keyof typeof latinFields];

            if (latinField) {
                next[latinField] = value
                    ? transliterate(value as string)
                    : "";
            }

            return next;
        });
        setCheckoutStatus("idle");
    }

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
                <div className="space-y-1">
                    <Input
                        placeholder="Full name"
                        value={form.shipping_full_name}
                        onChange={(e) => onFieldChange("shipping_full_name", e.target.value)}
                    />
                    {form.shipping_full_name_latin &&
                        <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                            <span>
                                {form.shipping_full_name_latin}
                            </span>

                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto px-2 py-0 text-xs"
                            >
                                <Pencil className="mr-1 h-3 w-3" />
                                Edit
                            </Button>
                        </div>
                    }
                    {getFieldError("shipping_full_name") && (
                        <p className="text-sm text-red-500">
                            {getFieldError("shipping_full_name")}
                        </p>
                    )}
                </div>

                <div className="space-y-1">
                    <Input
                        placeholder="Phone"
                        value={form.shipping_phone}
                        onChange={(e) => onFieldChange("shipping_phone", e.target.value)}
                    />
                    {getFieldError("shipping_phone") && (
                        <p className="text-sm text-red-500">
                            {getFieldError("shipping_phone")}
                        </p>
                    )}
                </div>

                <div className="space-y-1">
                    <Input
                        placeholder="Email"
                        type="email"
                        value={form.shipping_email}
                        onChange={(e) => onFieldChange("shipping_email", e.target.value)}
                    />
                    {getFieldError("shipping_email") && (
                        <p className="text-sm text-red-500">
                            {getFieldError("shipping_email")}
                        </p>
                    )}
                </div>

                <div className="space-y-1">
                    <Input
                        placeholder="Address line 1"
                        value={form.shipping_address_line1}
                        onChange={(e) => onFieldChange("shipping_address_line1", e.target.value)}
                    />
                    {getFieldError("shipping_address_line1") && (
                        <p className="text-sm text-red-500">
                            {getFieldError("shipping_address_line1")}
                        </p>
                    )}
                </div>

                <div className="space-y-1">
                    <Input
                        placeholder="Address line 2"
                        value={form.shipping_address_line2}
                        onChange={(e) => onFieldChange("shipping_address_line2", e.target.value)}
                    />
                    {getFieldError("shipping_address_line2") && (
                        <p className="text-sm text-red-500">
                            {getFieldError("shipping_address_line2")}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Input
                            placeholder="City"
                            value={form.shipping_city}
                            onChange={(e) => onFieldChange("shipping_city", e.target.value)}
                        />
                        {getFieldError("shipping_city") && (
                            <p className="text-sm text-red-500">
                                {getFieldError("shipping_city")}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Input
                            placeholder="State"
                            value={form.shipping_state}
                            onChange={(e) => onFieldChange("shipping_state", e.target.value)}
                        />
                        {getFieldError("shipping_state") && (
                            <p className="text-sm text-red-500">
                                {getFieldError("shipping_state")}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Input
                            placeholder="Postal code"
                            value={form.shipping_postal_code}
                            onChange={(e) => onFieldChange("shipping_postal_code", e.target.value)}
                        />
                        {getFieldError("shipping_postal_code") && (
                            <p className="text-sm text-red-500">
                                {getFieldError("shipping_postal_code")}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <div className="hidden md:block">
                            <SelectCountryForm
                                form={form}
                                setForm={setForm}
                                setShippingMethod={setShippingMethod}
                                setPayload={setPayload}
                            />
                        </div>

                        <div className="md:hidden">
                            <MobileSelectCountryForm
                                form={form}
                                setForm={setForm}
                                setShippingMethod={setShippingMethod}
                                setPayload={setPayload}
                            />
                        </div>

                        {getFieldError("shipping_country") && (
                            <p className="text-sm text-red-500 mt-1">
                                {getFieldError("shipping_country")}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* SHIPPING METHODS */}
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-3">
                    Shipping methods
                </h3>

                {!form.shipping_country ? (
                    <p className="text-sm text-muted-foreground">
                        Enter country to see shipping options
                    </p>
                ) : isLoading || isFetching ? (
                    <p className="text-sm text-muted-foreground">
                        Loading shipping methods...
                    </p>
                ) : (
                    <>
                        {shippingMethod && <FinalCarriers country={form.shipping_country} />}

                        <ShippingMethodsSelector
                            methods={shippingOptions}
                            value={shippingMethod}
                            onChange={setShippingMethod}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
