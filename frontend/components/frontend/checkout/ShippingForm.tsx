"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useShippingCalculate } from "@/hooks/use-shipping-calculate";
import { ShippingMethod } from "@/types/shipping";
import { OrderPayload } from "@/types/order";
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

type Props = {
    form: OrderPayload;
    setForm: (form: any) => void;
    shippingMethod: ShippingMethod | undefined;
    setShippingMethod: (method: ShippingMethod | undefined) => void;
    cartKey: string | undefined;
};

export function ShippingForm({
    form,
    setForm,
    shippingMethod,
    setShippingMethod,
    cartKey
}: Props) {
    const [payload, setPayload] = useState<{
        shipping_country: string;
        shipping_postal_code?: string;
    } | null>(null);

    const { data: shippingOptions = [], isLoading } =  useShippingCalculate(payload, cartKey);

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

        const stillValid =
            shippingMethod &&
            shippingOptions.some((m: ShippingMethod) => m.id === shippingMethod.id);

        // if current method is still valid → keep it
        if (stillValid) return;

        setShippingMethod(shippingOptions[0]);
    }, [shippingOptions]);

    const COUNTRIES = [
        { code: "US", name: "United States" },
        { code: "UA", name: "Ukraine" },

        // divider (handled in UI, not data logic)
        { code: "__divider__", name: "──────────" },

        // EU
        { code: "AT", name: "Austria" },
        { code: "BE", name: "Belgium" },
        { code: "BG", name: "Bulgaria" },
        { code: "HR", name: "Croatia" },
        { code: "CY", name: "Cyprus" },
        { code: "CZ", name: "Czechia" },
        { code: "DK", name: "Denmark" },
        { code: "EE", name: "Estonia" },
        { code: "FI", name: "Finland" },
        { code: "FR", name: "France" },
        { code: "DE", name: "Germany" },
        { code: "GR", name: "Greece" },
        { code: "HU", name: "Hungary" },
        { code: "IE", name: "Ireland" },
        { code: "IT", name: "Italy" },
        { code: "LV", name: "Latvia" },
        { code: "LT", name: "Lithuania" },
        { code: "LU", name: "Luxembourg" },
        { code: "MT", name: "Malta" },
        { code: "NL", name: "Netherlands" },
        { code: "PL", name: "Poland" },
        { code: "PT", name: "Portugal" },
        { code: "RO", name: "Romania" },
        { code: "SK", name: "Slovakia" },
        { code: "SI", name: "Slovenia" },
        { code: "ES", name: "Spain" },
        { code: "SE", name: "Sweden" },

        // Europe non-EU
        { code: "GB", name: "United Kingdom" },
        { code: "CH", name: "Switzerland" },
        { code: "NO", name: "Norway" },
        { code: "IS", name: "Iceland" },
        { code: "LI", name: "Liechtenstein" },

        // North America
        { code: "CA", name: "Canada" },

        // Oceania
        { code: "AU", name: "Australia" },
        { code: "NZ", name: "New Zealand" },
    ] as const;
    const selectedCountry = COUNTRIES.find(
        (c) => c.code === form.shipping_country
    );

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

                    <Popover>
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
                                                            setForm({
                                                                ...form,
                                                                shipping_country: country.code,
                                                            });

                                                            if (!country.code) {
                                                                setShippingMethod(undefined);
                                                                setPayload(null);
                                                            }
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
                ) : isLoading ? (
                    <p className="text-sm text-muted-foreground">
                        Loading shipping methods...
                    </p>
                ) : (
                    <ShippingMethodsSelector
                        methods={shippingOptions}
                        value={shippingMethod}
                        onChange={setShippingMethod}
                    />
                )}
            </div>
        </div>
    );
}
