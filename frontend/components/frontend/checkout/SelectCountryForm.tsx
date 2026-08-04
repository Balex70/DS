"use client";

import { useState } from "react";
import { ShippingMethod } from "@/types/shipping";
import { OrderPayload } from "@/types/order";
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
import { COUNTRIES, getSelectedCountry } from "@/config/countries";

type Props = {
    form: OrderPayload;
    setForm: React.Dispatch<React.SetStateAction<OrderPayload>>;
    setShippingMethod: (method: ShippingMethod | undefined) => void;
    setPayload: React.Dispatch<React.SetStateAction<{ shipping_country: string; shipping_postal_code?: string; } | null>>
};

export function SelectCountryForm({
    form,
    setForm,
    setShippingMethod,
    setPayload
}: Props) {
    const [openCountryPopover, setOpenCountryPopover] = useState(false);
    const selectedCountry = getSelectedCountry(form.shipping_country);

    return (
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
    );
}
