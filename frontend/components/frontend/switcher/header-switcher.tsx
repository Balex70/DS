'use client';

import {
    Popover,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";

import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useCurrency } from "@/context/CurrencyContext";
import { Locale } from "@/i18n/config";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { Check, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HeaderSwitcher() {
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
        <Popover>
            <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost">
                            <Globe /> {locale.toUpperCase()} / {currency}
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-64">

                        <DropdownMenuLabel>Language</DropdownMenuLabel>

                        <DropdownMenuItem onClick={() => switchLocale("en")}>
                            <Check className={cn(
                                "mr-2 h-4 w-4",
                                locale === "en" ? "opacity-100" : "opacity-0"
                            )}/>
                            English
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => switchLocale("uk")}>
                            <Check className={cn(
                                "mr-2 h-4 w-4",
                                locale === "uk" ? "opacity-100" : "opacity-0"
                            )}/>
                            Українська
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuLabel>Currency</DropdownMenuLabel>

                        <DropdownMenuItem onClick={() => setCurrency("USD")}>
                            <Check className={cn(
                                "mr-2 h-4 w-4",
                                currency === "USD" ? "opacity-100" : "opacity-0"
                            )}/>
                            USD
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => setCurrency("UAH")}>
                            <Check className={cn(
                                "mr-2 h-4 w-4",
                                currency === "UAH" ? "opacity-100" : "opacity-0"
                            )}/>
                            UAH
                        </DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>
        </Popover>
    );
}
