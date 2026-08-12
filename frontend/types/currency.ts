export const CURRENCIES = {
    USD: {
        code: "USD",
        locale: "en-US",
    },
    EUR: {
        code: "EUR",
        locale: "de-DE",
    },
    UAH: {
        code: "UAH",
        locale: "uk-UA",
    },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

export type Currency = {
    id: number;
    from_currency: string;
    to_currency: string;
    rate: number;
    rate_updated_at: string;
};
