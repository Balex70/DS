'use client';

import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useMemo, useState } from "react";
import BottomSheetHeader from "../bottom-sheet-header";
import { useLocale, useTranslations } from 'next-intl'
import { OrderPayload } from "@/types/order";
import { ShippingMethod } from "@/types/shipping";
import { getLocalizedCountries, getLocalizedSelectedCountry } from "@/config/countries";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {
    form: OrderPayload;
    setForm: React.Dispatch<React.SetStateAction<OrderPayload>>;
    setShippingMethod: (method: ShippingMethod | undefined) => void;
    setPayload: React.Dispatch<React.SetStateAction<{ shipping_country: string; shipping_postal_code?: string; } | null>>
};

export default function MobileSelectCountryForm({
    form,
    setForm,
    setShippingMethod,
    setPayload
}: Props) {
    const [open, setOpen] = useState(false);
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
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                >
                    {selectedCountry?.name ?? t('checkout.select_country')}

                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
            </SheetTrigger>

            <SheetContent side="bottom" className="!h-dvh max-h-dvh w-full rounded-none">
                <BottomSheetHeader>{t('checkout.select_country')}</BottomSheetHeader>
                
                <Separator className="my-0" />
                <ScrollArea className="h-[calc(100dvh-64px)]">
                    <div className="overflow-y-auto">
                        {countries.map((country) =>
                            country.code === "__divider__" ? (
                                <Separator key="divider" />
                            ) : (
                                <button
                                    key={country.code}
                                    type="button"
                                    onClick={() => {
                                        setShippingMethod(undefined);
                                        setPayload(null);

                                        setForm(prev => ({
                                            ...prev,
                                            shipping_country: country.code,
                                        }));

                                        setOpen(false);
                                    }}
                                    className="
                                        flex w-full items-center justify-between
                                        px-4 py-3
                                        text-left
                                        hover:bg-muted
                                        active:bg-muted/80
                                        transition-colors
                                    "
                                >
                                    <span>{country.name}</span>

                                    {form.shipping_country === country.code && (
                                        <Check className="h-5 w-5 text-primary" />
                                    )}
                                </button>
                            )
                        )}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
