'use client';

import { ReactNode, useEffect, useState } from "react";
import Cookies from 'js-cookie'
import { CurrencyContext } from "@/context/CurrencyContext";
import { CURRENCIES, CurrencyCode } from "@/types/currency";
import { useRouter } from "@/i18n/navigation";

const DEFAULT_CURRENCY = "USD";
const COOKIE_NAME = "currency";

export function isCurrencyCode(
    value: string | undefined
): value is CurrencyCode {
    return value !== undefined && value in CURRENCIES;
}

export function CurrencyContextWrapper({
    children,
}: {
    children: ReactNode;
}) {
    const router = useRouter();
    const [currency, setCurrency] = useState<CurrencyCode>(() => {
        const saved = Cookies.get(COOKIE_NAME);

        return isCurrencyCode(saved) ? saved : DEFAULT_CURRENCY;
    });

    const updateCurrency = (currency: CurrencyCode) => {
        Cookies.set(COOKIE_NAME, currency, {
            expires: 365,
        });

        setCurrency(currency);
        router.refresh();
    };

    return (
        <CurrencyContext.Provider
            value={{
                currency,
                setCurrency: updateCurrency,
            }}
        >
            {children}
        </CurrencyContext.Provider>
    );
}
