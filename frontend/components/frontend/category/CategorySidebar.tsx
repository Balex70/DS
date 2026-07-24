"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { PriceFilter } from "./PriceFilter";
import { MaterialsFilter } from "./MaterialsFilter";
import { MaterialOption } from "@/types/material";

type Props = {
    minPrice: number;
    maxPrice: number;
    price: [number, number];
    activeMaterials: number[];
    materialsOptions: MaterialOption[];
    onPriceChange: (value: [number, number]) => void,
    setPriceApplied: () => void,
    setActiveMaterials: (value: number[]) => void
};

export function CategorySidebar({
    minPrice, maxPrice, price,
    activeMaterials,
    materialsOptions,
    onPriceChange,
    setPriceApplied,
    setActiveMaterials
}: Props) {
    return (
        <div className="rounded-lg border bg-card">
            <div className="border-b p-4">
                <h2 className="font-semibold">
                    Filter
                </h2>
            </div>

            <ScrollArea className="h-[calc(100vh-12rem)]">
                <div>
                    <PriceFilter
                        min={minPrice}
                        max={maxPrice}
                        value={price}
                        onChange={onPriceChange}
                        setPriceApplied={setPriceApplied}
                        buttonActive={true}
                        />

                    <MaterialsFilter
                        activeMaterials={activeMaterials}
                        materialsOptions={materialsOptions}
                        onChange={setActiveMaterials}
                        />

                    {/* <WeightFilter min={data.weight.min} max={data.weight.max} /> */}
                </div>
            </ScrollArea>
        </div>
    );
}
