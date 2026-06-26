"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { PriceFilter } from "./PriceFilter";
import { MaterialsFilter } from "./MaterialsFilter";

type Props = {
    minPrice: number;
    maxPrice: number;
    price: [number, number];
    activeMaterials: string[];
    materialsOptions: string[];
    onPriceChange: (value: [number, number]) => void,
    setPriceApplied: () => void,
    setActiveMaterials: (value: string[]) => void
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
