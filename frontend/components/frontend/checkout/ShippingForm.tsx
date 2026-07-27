"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useShippingCalculate } from "@/hooks/use-shipping-calculate";
import { ShippingMethod } from "@/types/shipping";
import { CheckoutStatus, OrderPayload } from "@/types/order";
import { ShippingMethodsSelector } from "./ShippingMethodsSelector";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FinalCarriers } from "./FinalCarriers";
import { COUNTRIES, getSelectedCountry } from "@/config/countries";
import { useCurrency } from "@/context/CurrencyContext";

type Props = {
    form: OrderPayload;
    setForm: React.Dispatch<React.SetStateAction<OrderPayload>>;
    setCheckoutStatus: (status: CheckoutStatus) => void;
    shippingMethod: ShippingMethod | undefined;
    setShippingMethod: (method: ShippingMethod | undefined) => void;
    cartKey: string | undefined;
    errors: Record<string, string[]>
};

export function ShippingForm({
    form,
    setForm,
    setCheckoutStatus,
    shippingMethod,
    setShippingMethod,
    cartKey,
    errors
}: Props) {
    const [payload, setPayload] = useState<{
        shipping_country: string;
        shipping_postal_code?: string;
    } | null>(null);
    const { currency } = useCurrency();
    const { data: shippingOptions = [], isLoading, isFetching } =  useShippingCalculate(payload, cartKey, currency);
    const getError = (field: string) => errors[field]?.[0];
    const [openCountryPopover, setOpenCountryPopover] = useState(false);

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

    const onFieldChange = <K extends keyof OrderPayload>(field: K, value: OrderPayload[K]) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setCheckoutStatus("idle");
    }

    const selectedCountry = getSelectedCountry(form.shipping_country);

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
                    {getError("shipping_full_name") && (
                        <p className="text-sm text-red-500">
                            {getError("shipping_full_name")}
                        </p>
                    )}
                </div>

                <div className="space-y-1">
                    <Input
                        placeholder="Phone"
                        value={form.shipping_phone}
                        onChange={(e) => onFieldChange("shipping_phone", e.target.value)}
                    />
                    {getError("shipping_phone") && (
                        <p className="text-sm text-red-500">
                            {getError("shipping_phone")}
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
                    {getError("shipping_email") && (
                        <p className="text-sm text-red-500">
                            {getError("shipping_email")}
                        </p>
                    )}
                </div>

                <div className="space-y-1">
                    <Input
                        placeholder="Address line 1"
                        value={form.shipping_address_line1}
                        onChange={(e) => onFieldChange("shipping_address_line1", e.target.value)}
                    />
                    {getError("shipping_address_line1") && (
                        <p className="text-sm text-red-500">
                            {getError("shipping_address_line1")}
                        </p>
                    )}
                </div>

                <div className="space-y-1">
                    <Input
                        placeholder="Address line 2"
                        value={form.shipping_address_line2}
                        onChange={(e) => onFieldChange("shipping_address_line2", e.target.value)}
                    />
                    {getError("shipping_address_line2") && (
                        <p className="text-sm text-red-500">
                            {getError("shipping_address_line2")}
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
                        {getError("shipping_city") && (
                            <p className="text-sm text-red-500">
                                {getError("shipping_city")}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Input
                            placeholder="State"
                            value={form.shipping_state}
                            onChange={(e) => onFieldChange("shipping_state", e.target.value)}
                        />
                        {getError("shipping_state") && (
                            <p className="text-sm text-red-500">
                                {getError("shipping_state")}
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
                        {getError("shipping_postal_code") && (
                            <p className="text-sm text-red-500">
                                {getError("shipping_postal_code")}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Popover open={openCountryPopover} onOpenChange={setOpenCountryPopover}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className="w-full justify-between"
                                >
                                    {selectedCountry?.name ?? "Select country"}

                                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent align="start"
                                sideOffset={4}
                                className="w-[--radix-popover-trigger-width] p-0">
                                <div className="w-[var(--radix-popover-trigger-width)]">
                                    <Command>
                                        <CommandInput placeholder="Search country..." />

                                        <CommandList>
                                            <CommandEmpty>No country found.</CommandEmpty>

                                            <CommandGroup>
                                                {COUNTRIES.map((country) =>
                                                    country.code === "__divider__" ? (
                                                        <div key="divider" className="my-2 border-t" />
                                                    ) : (
                                                        <CommandItem
                                                            key={country.code}
                                                            value={country.name}
                                                            onSelect={() => {
                                                                setShippingMethod(undefined);
                                                                setPayload(null);
                                                                setForm(prev => ({
                                                                    ...prev,
                                                                    shipping_country: country.code,
                                                                }));
                                                                setOpenCountryPopover(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    form.shipping_country === country.code
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />

                                                            {country.name}
                                                        </CommandItem>
                                                    )
                                                )}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </div>
                            </PopoverContent>
                        </Popover>
                        {getError("shipping_country") && (
                            <p className="text-sm text-red-500 mt-1">
                                {getError("shipping_country")}
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
