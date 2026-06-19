export const COUNTRIES = [
        { code: "US", name: "United States" },
        { code: "UA", name: "Ukraine" },

        // divider (handled in UI, not data logic)
        { code: "__divider__", name: "──────────" },

        // EU
        { code: "AT", name: "Austria" },
        { code: "BE", name: "Belgium" },
        { code: "BG", name: "Bulgaria" },
        { code: "HR", name: "Croatia" },
        { code: "CY", name: "Cyprus" },
        { code: "CZ", name: "Czechia" },
        { code: "DK", name: "Denmark" },
        { code: "EE", name: "Estonia" },
        { code: "FI", name: "Finland" },
        { code: "FR", name: "France" },
        { code: "DE", name: "Germany" },
        { code: "GR", name: "Greece" },
        { code: "HU", name: "Hungary" },
        { code: "IE", name: "Ireland" },
        { code: "IT", name: "Italy" },
        { code: "LV", name: "Latvia" },
        { code: "LT", name: "Lithuania" },
        { code: "LU", name: "Luxembourg" },
        { code: "MT", name: "Malta" },
        { code: "NL", name: "Netherlands" },
        { code: "PL", name: "Poland" },
        { code: "PT", name: "Portugal" },
        { code: "RO", name: "Romania" },
        { code: "SK", name: "Slovakia" },
        { code: "SI", name: "Slovenia" },
        { code: "ES", name: "Spain" },
        { code: "SE", name: "Sweden" },

        // Europe non-EU
        { code: "GB", name: "United Kingdom" },
        { code: "CH", name: "Switzerland" },
        { code: "NO", name: "Norway" },
        { code: "IS", name: "Iceland" },
        { code: "LI", name: "Liechtenstein" },

        // North America
        { code: "CA", name: "Canada" },

        // Oceania
        { code: "AU", name: "Australia" },
        { code: "NZ", name: "New Zealand" },
    ] as const;

export const getSelectedCountry = (shipping_country: string) => COUNTRIES.find(
    (c) => c.code === shipping_country
);
