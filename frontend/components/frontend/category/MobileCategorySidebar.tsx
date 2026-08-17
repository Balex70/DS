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
import { useTranslations } from "next-intl";
import { MobileMaterialsFilter } from "./MobileMaterialsFilter";

type Props = {
    hasProducts?: boolean;
    isLoading: boolean;
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
    hasProducts,
    isLoading,
    minPrice, maxPrice, price,
    activeMaterials,
    materialsOptions,
    onPriceChange,
    setPriceApplied,
    setActiveMaterials
}: Props) {
    const [open, setOpen] = useState(false);
    const [activeDraftMaterials, setActiveDraftMaterials] = useState<number[]>([...activeMaterials]);
    const t = useTranslations('frontend')
    if (!isLoading && !hasProducts) return;

    const handleOpenChange = (nextOpen: boolean) => {
        if (nextOpen) {
            setActiveDraftMaterials([...activeMaterials]);
        }

        setOpen(nextOpen);
    };

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-9 rounded-2xl border border-input bg-background px-3 shadow-xs hover:bg-accent"
                    >
                    <Funnel className="mr-2 h-4 w-4 text-muted-foreground" />
                    {t('category.filter.header')}
                </Button>
            </SheetTrigger>

            <SheetContent side="bottom" className="!h-dvh max-h-dvh w-full rounded-none">
                <BottomSheetHeader>{t('category.filter.header')}</BottomSheetHeader>

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

                        <MobileMaterialsFilter
                            activeMaterials={activeDraftMaterials}
                            materialsOptions={materialsOptions}
                            onChange={setActiveDraftMaterials}
                            />

                        <Button
                            className="w-full my-4"
                            onClick={() => {
                                setPriceApplied()
                                setActiveMaterials(activeDraftMaterials)
                                setOpen(false)
                            }}
                        >
                            {t('category.filter.apply')}
                        </Button>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
