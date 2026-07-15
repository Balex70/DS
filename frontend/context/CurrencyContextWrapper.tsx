'use client';

import { ReactNode, useEffect, useState } from "react";
import Cookies from 'js-cookie'
import { CurrencyContext } from "@/context/CurrencyContext";
import { CurrencyCode } from "@/types/currency";

const DEFAULT_CURRENCY = "USD";
const COOKIE_NAME = "currency";

export function CurrencyContextWrapper({
    children,
}: {
    children: ReactNode;
}) {
    const [currency, setCurrency] = useState(DEFAULT_CURRENCY);

    useEffect(() => {
        const saved = Cookies.get(COOKIE_NAME);

        if (saved) {
            setCurrency(saved);
        }
    }, []);

    const updateCurrency = (currency: CurrencyCode) => {
        Cookies.set(COOKIE_NAME, currency, {
            expires: 365,
        });

        setCurrency(currency);
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
