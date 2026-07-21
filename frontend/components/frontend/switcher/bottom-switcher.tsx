'use client';

import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useCurrency } from "@/context/CurrencyContext";
import { Locale } from "@/i18n/config";
import { Globe } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LOCALES } from "@/config/locales";
import { CURRENCIES } from "@/config/currencies";

export default function BottomSwitcher() {
    const router = useRouter();
    const pathname = usePathname();

    const locale = useLocale();
    const { currency, setCurrency } = useCurrency();

    function switchLocale(nextLocale: Locale) {
        const segments = pathname.split("/");
        segments[1] = nextLocale;
        router.push(segments.join("/"));
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-full flex-1 rounded-none"
                >
                    <div className="flex flex-col items-center gap-1">
                        <Globe className="h-6 w-6 text-muted-foreground" />

                        <span className="text-xs text-muted-foreground">
                            {locale.toUpperCase()} / {currency}
                        </span>
                    </div>
                </Button>
            </SheetTrigger>

            <SheetContent side="bottom" className="!h-dvh max-h-dvh w-full rounded-none">
                <SheetHeader className="pb-0">
                    <SheetTitle><Globe /> {locale.toUpperCase()} / {currency}</SheetTitle>
                </SheetHeader>
                
                <Separator className="my-0" />

                <div className="space-y-6 p-4">
                    <div>
                        <Label>Language</Label>

                        <Select value={locale} onValueChange={switchLocale}>
                            <SelectTrigger className="mt-2 w-full">
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                                {LOCALES.map(locale => (
                                    <SelectItem
                                        key={locale.code}
                                        value={locale.code}
                                    >
                                        {locale.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Currency</Label>

                        <Select value={currency} onValueChange={setCurrency}>
                            <SelectTrigger className="mt-2 w-full">
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                                {CURRENCIES.map(currency => (
                                    <SelectItem
                                        key={currency.code}
                                        value={currency.code}
                                    >
                                        {currency.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
