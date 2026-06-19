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
    postnord: {
        id: "postnord",
        logo: "/carriers/postnord.svg",
    },
    dao: {
        id: "dao",
        logo: "/carriers/dao.svg",
    },
    omniva: {
        id: "omniva",
        logo: "/carriers/omniva.svg",
    },
    smartposti: {
        id: "smartposti",
        logo: "/carriers/smartposti.avif",
    },
    posti_group: {
        id: "posti_group",
        logo: "/carriers/posti_group.svg",
    },
    matkahuolto: {
        id: "matkahuolto",
        logo: "/carriers/matkahuolto.svg",
    },
    colissimo: {
        id: "colissimo",
        logo: "/carriers/colissimo.svg",
    },
    chronopost: {
        id: "chronopost",
        logo: "/carriers/chronopost.svg",
    },
    hermes: {
        id: "hermes",
        logo: "/carriers/hermes.svg",
    },
    an_post: {
        id: "an_post",
        logo: "/carriers/an_post.svg",
    },
    poste_italiane: {
        id: "poste_italiane",
        logo: "/carriers/poste_italiane.svg",
    },
    post_nl: {
        id: "post_nl",
        logo: "/carriers/post_nl.svg",
    },
    in_post: {
        id: "in_post",
        logo: "/carriers/in_post.svg",
    },
    polish_post: {
        id: "polish_post",
        logo: "/carriers/polish_post.svg",
    },
    correos: {
        id: "correos",
        logo: "/carriers/correos.svg",
    },
    seur: {
        id: "seur",
        logo: "/carriers/seur.svg",
    },
    mrw: {
        id: "mrw",
        logo: "/carriers/mrw.svg",
    },
    db_schenker: {
        id: "db_schenker",
        logo: "/carriers/db_schenker.svg",
    },
    royal_mail: {
        id: "royal_mail",
        logo: "/carriers/royal_mail.svg",
    },
    evri: {
        id: "evri",
        logo: "/carriers/evri.svg",
    },
    yodel: {
        id: "yodel",
        logo: "/carriers/yodel.svg",
    },
};

const COUNTRY_CARRIERS: Record<string, string[]> = {
    UA: ["nova_poshta", "ukrposhta", "meest"],
    US: ["usps", "ups", "fedex", "dhl"],
    AT: ["austrian_post", "dpd", "gls", "dhl"],
    BE: ["bpost", "dpd", "gls", "dhl"],
    HR: ["croatian_post", "dpd", "gls", "dhl"],
    CZ: ["czech_post", "zasilkovna", "ppl", "dpd"],
    DK: ["postnord", "gls", "dao", "dpd", "dhl"],
    EE: ["omniva", "smartposti", "dpd"],
    FI: ["posti_group", "matkahuolto", "dpd", "gls"],
    FR: ["colissimo", "chronopost", "dpd", "gls"],
    DE: ["dhl", "hermes", "dpd", "gls"],
    IE: ["an_post", "dpd", "gls", "dhl"], // couldn't find logo for fastway
    IT: ["poste_italiane", "dpd", "gls", "dhl"],
    NL: ["post_nl", "dhl", "dpd", "gls", "in_post"],
    PL: ["polish_post", "in_post", "dpd", "dhl"],
    ES: ["correos", "seur", "mrw", "gls"],
    SE: ["postnord", "dhl", "db_schenker", "dpd", "gls"],
    GB: ["royal_mail", "evri", "dpd", "yodel"],
};

export function getCountryCarriers(country?: string): Carrier[] {
    if (!country) return [];

    const ids = COUNTRY_CARRIERS[country.toUpperCase()] ?? [];

    return ids
        .map(id => CARRIERS[id])
        .filter(Boolean);
}
