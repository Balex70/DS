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
    austrian_post: {
        id: "austrian_post",
        logo: "/carriers/austrian_post.svg",
    },
    dpd: {
        id: "dpd",
        logo: "/carriers/dpd.svg",
    },
    gls: {
        id: "gls",
        logo: "/carriers/gls.svg",
    },
    bpost: {
        id: "bpost",
        logo: "/carriers/bpost.svg",
    },
    croatian_post: {
        id: "croatian_post",
        logo: "/carriers/croatian_post.svg",
    },
    czech_post: {
        id: "czech_post",
        logo: "/carriers/czech_post.svg",
    },
    zasilkovna: {
        id: "zasilkovna",
        logo: "/carriers/zasilkovna.svg",
    },
    ppl: {
        id: "ppl",
        logo: "/carriers/ppl.svg",
    },
};

const COUNTRY_CARRIERS: Record<string, string[]> = {
    UA: ["nova_poshta", "ukrposhta", "meest"],
    US: ["usps", "ups", "fedex", "dhl"],
    AT: ["austrian_post", "dpd", "gls", "dhl"],
    BE: ["bpost", "dpd", "gls", "dhl"],
    HR: ["croatian_post", "dpd", "gls", "dhl"],
    CZ: ["czech_post", "zasilkovna", "ppl", "dpd"],
};

export function getCountryCarriers(country?: string): Carrier[] {
    if (!country) return [];

    const ids = COUNTRY_CARRIERS[country.toUpperCase()] ?? [];

    return ids
        .map(id => CARRIERS[id])
        .filter(Boolean);
}
