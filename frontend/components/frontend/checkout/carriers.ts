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
    dhl: {
        id: "dhl",
        logo: "/carriers/dhl.svg",
    },
    usps: {
        id: "usps",
        name: "USPS",
        logo: "/carriers/usps.svg",
    },
};

const COUNTRY_CARRIERS: Record<string, string[]> = {
    UA: ["nova_poshta", "ukrposhta"],
    US: ["usps"],
    DE: ["dhl"],
};

export function getCountryCarriers(country?: string): Carrier[] {
    if (!country) return [];

    const ids = COUNTRY_CARRIERS[country.toUpperCase()] ?? [];

    return ids
        .map(id => CARRIERS[id])
        .filter(Boolean);
}
