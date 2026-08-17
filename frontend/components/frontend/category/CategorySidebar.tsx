"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { PriceFilter } from "./PriceFilter";
import { MaterialsFilter } from "./MaterialsFilter";
import { MaterialOption } from "@/types/material";
import { useTranslations } from "next-intl";

type Props = {
    hasProducts?: boolean;
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
    hasProducts,
    minPrice, maxPrice, price,
    activeMaterials,
    materialsOptions,
    onPriceChange,
    setPriceApplied,
    setActiveMaterials
}: Props) {
    const t = useTranslations('frontend')

    return (
        <div className="rounded-lg border bg-card">
            <div className="border-b p-4">
                <h2 className="font-semibold">
                    {t('category.filter.header')}
                </h2>
            </div>

            {!hasProducts ? (
                <div className="p-3 animate-pulse">
                    <div className="h-3 w-64 bg-gray-200 rounded" />

                    <div className="space-y-2 mt-4">
                        <div className="h-4 w-64 bg-gray-200 rounded" />
                    </div>
                </div>
            ) : (
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
            )}
        </div>
    );
}
