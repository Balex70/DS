export function detectCountry(): string {
    if (typeof navigator === "undefined") {
        return "";
    }

    const locales = navigator.languages.length
        ? navigator.languages
        : [navigator.language];

    for (const locale of locales) {
        const parts = locale.split("-");

        if (parts.length >= 2) {
            return parts[1].toUpperCase();
        }
    }

    return "";
}
