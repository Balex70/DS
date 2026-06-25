"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useEffect, useState } from "react";

type PriceFilterProps = {
    min: number;
    max: number;
    value: [number, number];
    onChange: (value: [number, number]) => void;
    setPriceApplied: () => void
};

export function PriceFilter({
    min,
    max,
    value,
    onChange,
    setPriceApplied
}: PriceFilterProps) {
    const toDisplay = (cents: number) => (cents / 100).toString();
    const toCents = (value: number) => Math.round(value * 100);

    const [localValue, setLocalValue] = useState<[number, number]>(value);

    return (
        <div className="space-y-4 pt-2 px-3">
            <div>
                <h3 className="text-sm font-medium">
                    Price (USD)
                </h3>
            </div>

            <Slider
                min={min}
                max={max}
                step={10}
                value={localValue}
                onValueChange={(v) => {
                        // set localValue and real value, because slider don't need additional validation
                        setLocalValue(v as [number, number])
                        onChange(v as [number, number]);
                    }
                }
            />
            <div className="flex gap-2">
                <Input
                    type="number"
                    value={toDisplay(localValue[0])}
                    onBlur={() => {
                        // only on blur check for safe inputs (min/max)
                        // to make UX better (type numbers without interrupting the user)
                        const safeMin = Math.max(min, Math.min(max, localValue[0]));
                        const safeMax = Math.max(safeMin, Math.min(max, localValue[1]));

                        const safe: [number, number] = [safeMin, safeMax];

                        onChange(safe); // update value (not localValue)
                        setLocalValue(safe)
                    }}
                    onChange={(e) => {
                        // Change only localValue (price) to make it possible validate on blur
                        const num = Number(e.target.value);
                        if (isNaN(num)) return;

                        setLocalValue([
                            toCents(num),
                            localValue[1],
                        ]);
                    }}
                    className="text-sm"
                />

                <Input
                    type="number"
                    value={toDisplay(localValue[1])}
                    onBlur={() => {
                        // only on blur check for safe inputs (min/max)
                        // to make UX better (type numbers without interrupting the user)
                        const safeMin = Math.max(min, Math.min(max, localValue[0]));
                        const safeMax = Math.max(safeMin, Math.min(max, localValue[1]));

                        const safe: [number, number] = [safeMin, safeMax];

                        onChange(safe); // update value (not localValue)
                        setLocalValue(safe)
                    }}
                    onChange={(e) => {
                        // Change only localValue (price) to make it possible validate on blur
                        const num = Number(e.target.value);
                        if (isNaN(num)) return;

                        setLocalValue([
                            localValue[0],
                            toCents(num),
                        ]);
                    }}
                    className="text-sm"
                />
            </div>
            <Button
                onClick={() => {
                    // trigger request to backend with actual price data
                    setPriceApplied()
                }}
            >
                Apply filters
            </Button>
        </div>
    );
}
