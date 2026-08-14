'use client';

import {
    Popover,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";

import { useRouter, usePathname } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useCurrency } from "@/context/CurrencyContext";
import { Locale } from "@/i18n/config";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { Check, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { LOCALES } from "@/config/locales";
import { CURRENCIES } from "@/config/currencies";

export default function HeaderSwitcher() {
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations('frontend')
    const activeLocale = useLocale();
    const { currency, setCurrency } = useCurrency();

    function switchLocale(nextLocale: Locale) {
        router.push(pathname, {locale: nextLocale});
    }

    return (
        <Popover>
            <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost">
                            <Globe /> {activeLocale.toUpperCase()} / {currency}
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-64">

                        <DropdownMenuLabel>{t('switcher.header.language')}</DropdownMenuLabel>
                        {LOCALES.map(locale => (
                            <DropdownMenuItem key={locale.code} onClick={() => switchLocale(locale.code)}>
                                <Check className={cn(
                                    "mr-2 h-4 w-4",
                                    locale.code === activeLocale ? "opacity-100" : "opacity-0"
                                )}/>
                                {locale.label}
                            </DropdownMenuItem>
                        ))}

                        <DropdownMenuSeparator />

                        <DropdownMenuLabel>{t('switcher.header.currency')}</DropdownMenuLabel>

                        {CURRENCIES.map(cur => (
                            <DropdownMenuItem key={cur.code} onClick={() => setCurrency(cur.code)}>
                                <Check className={cn(
                                    "mr-2 h-4 w-4",
                                    cur.code === currency ? "opacity-100" : "opacity-0"
                                )}/>
                                {cur.label}
                            </DropdownMenuItem>
                        ))}

                    </DropdownMenuContent>
                </DropdownMenu>
        </Popover>
    );
}
