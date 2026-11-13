"use client";

import { useMemo, useState } from "react";
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
import { getLocalizedCountries, getLocalizedSelectedCountry } from "@/config/countries";
import { useLocale, useTranslations } from "next-intl";

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
    const locale = useLocale();
    const t = useTranslations('frontend')

    const countries = useMemo(
        () => getLocalizedCountries(locale),
        [locale]
    );
    const selectedCountry = getLocalizedSelectedCountry(
        form.shipping_country,
        locale
    );
    return (
        <Popover open={openCountryPopover} onOpenChange={setOpenCountryPopover}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="
                        h-12
                        w-full
                        justify-between
                        !text-base
                        font-normal
                        rounded-lg
                        border-muted-foreground/25
                        transition-colors
                        focus-visible:border-emerald-500
                        focus-visible:ring-2
                        focus-visible:ring-emerald-500/20
                        focus-visible:ring-offset-0
                        data-[state=open]:border-emerald-500
                        data-[state=open]:ring-2
                        data-[state=open]:ring-emerald-500/20
                    "
                >
                    {selectedCountry?.name ?? t('checkout.select_country')}

                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent align="start"
                sideOffset={4}
                className="w-[--radix-popover-trigger-width] p-0">
                <div className="w-[var(--radix-popover-trigger-width)]">
                    <Command>
                        <CommandInput placeholder={t('checkout.search_country_placeholder')} className="!text-base" />

                        <CommandList>
                            <CommandEmpty>{t('checkout.no_country_found')}</CommandEmpty>

                            <CommandGroup>
                                {countries.map((country) =>
                                    country.code === "__divider__" ? (
                                        <div key="divider" className="my-2 border-t" />
                                    ) : (
                                        <CommandItem
                                            key={country.code}
                                            value={country.name}
                                            className="py-3 text-base"
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
