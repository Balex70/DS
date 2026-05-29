export function getMinDays(value?: string | null): number {
    if (!value) return Number.MAX_SAFE_INTEGER;

    const [min] = value.split("-");

    return parseInt(min, 10);
}

export function getMaxDays(value?: string | null): number {
    if (!value) return Number.MAX_SAFE_INTEGER;

    const [, max] = value.split("-");

    return parseInt(max, 10);
}
