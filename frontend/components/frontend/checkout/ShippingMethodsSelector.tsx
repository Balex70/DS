"use client";

import { ShippingMethod } from "@/types/shipping";
import { PriceRenderer } from "@/components/custom/PriceRenderer";
import { useMemo, useState } from "react";
import { getMaxDays, getMinDays } from "@/helpers/shipping";
import { ShippingTierBadge } from "./shippingTiers";
import { useCurrency } from "@/context/CurrencyContext";

type Props = {
    methods: ShippingMethod[];
    value: ShippingMethod | undefined;
    onChange: (method: ShippingMethod) => void;
};

export function ShippingMethodsSelector({
    methods,
    value,
    onChange,
}: Props) {
    const [showAll, setShowAll] = useState(false);
    const { currency } = useCurrency();

    const groupedMethods = useMemo(() => {
        if (methods.length === 0) {
            return {
                recommended: null,
                cheapest: null,
                fastest: null,
                remaining: [],
            };
        }

        const cheapest = [...methods].sort(
            (a, b) => a.price - b.price
        )[0];

        const fastest = [...methods].sort(
            (a, b) =>
                getMinDays(a.estimated_delivery) -
                getMinDays(b.estimated_delivery)
        )[0];

        // balanced method
        const recommended = [...methods].sort((a, b) => {
            const aScore =
                a.price + getMaxDays(a.estimated_delivery) * 10;

            const bScore =
                b.price + getMaxDays(b.estimated_delivery) * 10;

            return aScore - bScore;
        })[0];

        const usedIds = new Set([
            cheapest.id,
            fastest.id,
            recommended.id,
        ]);

        const remaining = methods.filter(
            (method) => !usedIds.has(method.id)
        );

        return {
            cheapest,
            fastest,
            recommended,
            remaining,
        };
    }, [methods]);

    const featured = methods
        .map((method) => {
            const labels: string[] = [];

            if (method.id === groupedMethods.recommended?.id) {
                labels.push("Recommended");
            }

            if (method.id === groupedMethods.cheapest?.id) {
                labels.push("Cheapest");
            }

            if (method.id === groupedMethods.fastest?.id) {
                labels.push("Fastest");
            }

            return {
                method,
                labels,
            };
        })
        .filter((item) => item.labels.length > 0);

    return (
        <div className="space-y-3 mt-8">
            {/* FEATURED METHODS */}
            {featured.map(({ method, labels }) => {
                const selected = value?.id === method.id;

                return (
                    <label
                        key={`${method.id}`}
                        className={`
                            flex cursor-pointer items-start justify-between rounded-xl border p-2 sm:p-4 transition
                            ${
                                selected
                                    ? "border-black bg-muted"
                                    : "hover:border-gray-400"
                            }
                        `}
                    >
                        <div className="flex items-start gap-3">
                            <input
                                type="radio"
                                checked={selected}
                                onChange={() => onChange(method)}
                                className="mt-1"
                            />

                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <ShippingTierBadge method={method} />

                                    <div className="flex flex-wrap gap-1">
                                        {labels.map((label) => (
                                            <span
                                                key={label}
                                                className="rounded-sm bg-gray-200 px-2 py-0.5 text-xs text-muted-foreground"
                                            >
                                                {label}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {method.estimated_delivery && (
                                    <div className="text-sm text-muted-foreground">
                                        {method.estimated_delivery} business
                                        days
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="font-semibold">
                            <PriceRenderer value={method.price} />
                            {(currency !== "USD" && method.currency_price) && (
                                <span className="block text-xs font-normal text-muted-foreground">
                                    (
                                    <PriceRenderer
                                        value={method.currency_price}
                                        currency={currency}
                                    />
                                    )
                                </span>
                            )}
                        </div>
                    </label>
                );
            })}

            {/* SHOW MORE */}
            {groupedMethods.remaining.length > 0 && (
                <div>
                    <button
                        type="button"
                        onClick={() => setShowAll((prev) => !prev)}
                        className="text-sm underline"
                    >
                        {showAll
                            ? "Hide shipping methods"
                            : `Show ${groupedMethods.remaining.length} more shipping methods`}
                    </button>

                    {showAll && (
                        <div className="mt-3 space-y-2">
                            {groupedMethods.remaining.map((method) => {
                                const selected =
                                    value?.id === method.id;

                                return (
                                    <label
                                        key={method.id}
                                        className={`
                                            flex cursor-pointer items-start justify-between rounded-lg border p-3 transition
                                            ${
                                                selected
                                                    ? "border-black bg-muted"
                                                    : "hover:border-gray-400"
                                            }
                                        `}
                                    >
                                        <div className="flex items-start gap-3">
                                            <input
                                                type="radio"
                                                checked={selected}
                                                onChange={() =>
                                                    onChange(method)
                                                }
                                                className="mt-1"
                                            />

                                            <div>
                                                <ShippingTierBadge method={method} />

                                                {method.estimated_delivery && (
                                                    <div className="text-sm text-muted-foreground">
                                                        {
                                                            method.estimated_delivery
                                                        }{" "}
                                                        business days
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="font-semibold">
                                            <PriceRenderer
                                                value={method.price}
                                            />
                                            {(currency !== "USD" && method.currency_price) && (
                                                <span className="block text-xs font-normal text-muted-foreground">
                                                    (
                                                    <PriceRenderer
                                                        value={method.currency_price}
                                                        currency={currency}
                                                    />
                                                    )
                                                </span>
                                            )}
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
