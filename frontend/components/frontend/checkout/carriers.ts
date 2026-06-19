export type Carrier = {
    id: string;
    name?: string;
    logo: string;
};

const CARRIERS: Record<string, Carrier> = {
    nova_poshta: {
        id: "nova_poshta",
        name: "Nova Poshta Global",
        logo: "/carriers/nova_poshta.svg",
    },
    ukrposhta: {
        id: "ukrposhta",
        name: "Ukrposhta",
        logo: "/carriers/ukrposhta.svg",
    },
    meest: {
        id: "meest",
        logo: "/carriers/meest.svg",
    },
    dhl: {
        id: "dhl",
        logo: "/carriers/dhl.svg",
    },
    usps: {
        id: "usps",
        logo: "/carriers/usps.svg",
    },
    ups: {
        id: "ups",
        logo: "/carriers/ups.svg",
    },
    fedex: {
        id: "fedex",
        logo: "/carriers/fedex.svg",
    },
};

const COUNTRY_CARRIERS: Record<string, string[]> = {
    UA: ["nova_poshta", "ukrposhta", "meest"],
    US: ["usps", "ups", "fedex", "dhl"],
    DE: ["dhl"],
};

export function getCountryCarriers(country?: string): Carrier[] {
    if (!country) return [];

    const ids = COUNTRY_CARRIERS[country.toUpperCase()] ?? [];

    return ids
        .map(id => CARRIERS[id])
        .filter(Boolean);
}
