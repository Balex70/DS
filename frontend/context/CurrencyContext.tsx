// CurrencyContext.tsx

import { CurrencyCode } from "@/types/currency";
import { createContext, useContext } from "react";

export type CurrencyContextValue = {
    currency: CurrencyCode;
    setCurrency: (currency: CurrencyCode) => void;
}

export const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function useCurrency() {
    const context = useContext(CurrencyContext);

    if (!context) {
        throw new Error("useCurrency must be used within CurrencyProvider");
    }

    return context;
}
