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
                    <span className="truncate">
                        {selectedCountry?.name ?? t('checkout.select_country')}
                    </span>

                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </SheetTrigger>

            <SheetContent side="bottom" className="!h-dvh max-h-dvh w-full rounded-none">
                <BottomSheetHeader className="font-semibold">{t('checkout.select_country')}</BottomSheetHeader>
                
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
                                        px-4 py-4
                                        text-left text-lg
                                        transition-colors
                                        hover:bg-green-50
                                        active:bg-green-100
                                        dark:hover:bg-green-950/40
                                        dark:active:bg-green-950/60
                                    "
                                >
                                    <span>{country.name}</span>

                                    {form.shipping_country === country.code && (
                                        <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
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
