'use client';

import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import BottomSheetHeader from "../bottom-sheet-header";
import { useTranslations } from 'next-intl'
import { OrderPayload } from "@/types/order";
import { ShippingMethod } from "@/types/shipping";
import { COUNTRIES, getSelectedCountry } from "@/config/countries";
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
    const selectedCountry = getSelectedCountry(form.shipping_country);
    
    const t = useTranslations('frontend')
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                >
                    {selectedCountry?.name ?? "Select country"}

                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
            </SheetTrigger>

            <SheetContent side="bottom" className="!h-dvh max-h-dvh w-full rounded-none">
                <BottomSheetHeader>Select Country</BottomSheetHeader>
                
                <Separator className="my-0" />
                <ScrollArea className="h-[calc(100dvh-64px)]">
                    <div className="overflow-y-auto">
                        {COUNTRIES.map((country) =>
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
