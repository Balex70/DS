type Props = {
    value: number | string | null | undefined; // cents
    currency?: string;
    showDecimals?: boolean;
    className?: string;
};

function formatPrice(
    cents: number,
    currency: string,
    showDecimals: boolean
) {
    const dollars = cents / 100;

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: showDecimals ? 2 : 0,
        maximumFractionDigits: 2,
    }).format(dollars);
}

export function PriceRenderer({
    value,
    currency = "USD",
    showDecimals = true,
    className = "",
}: Props) {
    if (value === null || value === undefined) {
        return <span className={className}>no price</span>;
    }

    const cents = typeof value === "string" ? parseInt(value, 10) : value;

    if (isNaN(cents)) {
        return <span className={className}>no price</span>;
    }

    return (
        <span className={className}>
            {formatPrice(cents, currency, showDecimals)}
        </span>
    );
}
