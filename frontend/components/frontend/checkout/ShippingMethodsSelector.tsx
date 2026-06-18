"use client";

import { ShippingMethod } from "@/types/shipping";
import { PriceRenderer } from "@/components/custom/PriceRenderer";
import { useMemo, useState } from "react";
import { getMaxDays, getMinDays } from "@/helpers/shipping";
import { ShippingTierBadge } from "./shippingTiers";

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

    const featured = [
        {
            label: "Recommended",
            method: groupedMethods.recommended,
        },
        {
            label: "Cheapest",
            method: groupedMethods.cheapest,
        },
        {
            label: "Fastest",
            method: groupedMethods.fastest,
        },
    ].filter(
        (
            item
        ): item is {
            label: string;
            method: ShippingMethod;
        } => Boolean(item.method)
    );

    return (
        <div className="space-y-3 mt-8">
            {/* FEATURED METHODS */}
            {featured.map(({ label, method }) => {
                const selected = value?.id === method.id;

                return (
                    <label
                        key={`${label}-${method.id}`}
                        className={`
                            flex cursor-pointer items-start justify-between rounded-xl border p-4 transition
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
                                <div className="flex items-center gap-2">
                                    <ShippingTierBadge method={method} />

                                    <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                        {label}
                                    </span>
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
