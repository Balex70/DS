"use client";

import { useEffect, useMemo, useState } from "react";
import { useShippingCalculate } from "@/hooks/use-shipping-calculate";
import { ShippingMethod } from "@/types/shipping";
import { CheckoutStatus, latinFieldsMapper, LatinFieldType, OrderPayload } from "@/types/order";
import { ShippingMethodsSelector } from "./ShippingMethodsSelector";
import { FinalCarriers } from "./FinalCarriers";
import { useCurrency } from "@/context/CurrencyContext";
import { SelectCountryForm } from "./SelectCountryForm";
import MobileSelectCountryForm from "./MobileSelectCountryForm";
import { checkoutSchemaValidation, CheckoutValidationType } from "@/helpers/validators/checkout-schema-validation";
import { z } from "zod";
import { transliterate } from "transliteration";
import { InputField } from "./InputField";
import { FieldLabel } from "@/components/ui/field";

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

    const onFieldChange = <K extends keyof OrderPayload>(field: K, value: OrderPayload[K]) => {
        setForm(prev => {
            const next = {
                ...prev,
                [field]: value,
            };

            const latinField = latinFieldsMapper[field as keyof typeof latinFieldsMapper];

            if (latinField) {
                next[latinField] = value
                    ? transliterate(value as string)
                    : "";
            }

            return next;
        });
        setCheckoutStatus("idle");
    }

    const onLatinFieldChange = <K extends LatinFieldType>(field: K, value: OrderPayload[K]) => {
        setForm((prev) => ({
                ...prev,
                [field]: value
        }));
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
            <div className="space-y-4" id="checkout-shipping-form">
                <InputField
                    form={form}
                    label="Full name"
                    fieldName="shipping_full_name"
                    latinFieldName="shipping_full_name_latin"
                    onFieldChange={onFieldChange}
                    onLatinFieldChange={onLatinFieldChange}
                    errors={errors}
                />

                <InputField
                    form={form}
                    label="Phone"
                    fieldName="shipping_phone"
                    onFieldChange={onFieldChange}
                    onLatinFieldChange={onLatinFieldChange}
                    errors={errors}
                />

                <InputField
                    form={form}
                    label="Email"
                    fieldName="shipping_email"
                    onFieldChange={onFieldChange}
                    onLatinFieldChange={onLatinFieldChange}
                    errors={errors}
                />

                <InputField
                    form={form}
                    label="Address line 1"
                    fieldName="shipping_address_line1"
                    latinFieldName="shipping_address_line1_latin"
                    onFieldChange={onFieldChange}
                    onLatinFieldChange={onLatinFieldChange}
                    errors={errors}
                />

                <InputField
                    form={form}
                    label="Address line 2"
                    fieldName="shipping_address_line2"
                    latinFieldName="shipping_address_line2_latin"
                    onFieldChange={onFieldChange}
                    onLatinFieldChange={onLatinFieldChange}
                    errors={errors}
                />


                <div className="grid grid-cols-2 gap-4">
                    <InputField
                        form={form}
                        label="City"
                        fieldName="shipping_city"
                        latinFieldName="shipping_city_latin"
                        onFieldChange={onFieldChange}
                        onLatinFieldChange={onLatinFieldChange}
                        errors={errors}
                    />

                    <InputField
                        form={form}
                        label="State"
                        fieldName="shipping_state"
                        latinFieldName="shipping_state_latin"
                        onFieldChange={onFieldChange}
                        onLatinFieldChange={onLatinFieldChange}
                        errors={errors}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <InputField
                        form={form}
                        label="Postal code"
                        fieldName="shipping_postal_code"
                        onFieldChange={onFieldChange}
                        onLatinFieldChange={onLatinFieldChange}
                        errors={errors}
                    />

                    <div className="space-y-1">
                        <FieldLabel className="text-sm text-muted-foreground font-normal">Country:</FieldLabel>
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
