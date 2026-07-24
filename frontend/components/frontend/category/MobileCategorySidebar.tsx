'use client';

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import BottomSheetHeader from "../bottom-sheet-header";
import { Funnel } from "lucide-react";
import { MaterialOption } from "@/types/material";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PriceFilter } from "./PriceFilter";
import { MaterialsFilter } from "./MaterialsFilter";

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

export function MobileCategorySidebar({
    minPrice, maxPrice, price,
    activeMaterials,
    materialsOptions,
    onPriceChange,
    setPriceApplied,
    setActiveMaterials
}: Props) {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-9 rounded-2xl border border-input bg-background px-3 shadow-xs hover:bg-accent"
                    >
                    <Funnel className="mr-2 h-4 w-4 text-muted-foreground" />
                    Filter
                </Button>
            </SheetTrigger>

            <SheetContent side="bottom" className="!h-dvh max-h-dvh w-full rounded-none">
                <BottomSheetHeader>Filter</BottomSheetHeader>

                <Separator />

                <ScrollArea className="h-[calc(100vh-12rem)]">
                <div className="mx-2">
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

                    <Button
                        className="w-full my-4"
                        onClick={() => {
                            setPriceApplied()
                            setOpen(false)
                        }}
                    >
                        Apply
                    </Button>
                </div>
            </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
