"use client";

import { PriceRenderer } from "@/components/custom/PriceRenderer";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

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
    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-sm font-medium">
                    Price
                </h3>
            </div>

            <Slider
                min={min}
                max={max}
                step={10}
                value={value}
                onValueChange={(v) => onChange(v as [number, number])}
            />

            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span><PriceRenderer value={value[0]} /></span>
                <span><PriceRenderer value={value[1]} /></span>
            </div>
            <Button
                onClick={() => setPriceApplied()}
            >
                Apply filters
            </Button>
        </div>
    );
}
