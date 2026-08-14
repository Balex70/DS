'use client';

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import BottomSheetHeader from "../bottom-sheet-header";
import { SortSelectValue } from "@/types/category";
import { ArrowUpDown } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
    value: SortSelectValue;
    onChange: (value: SortSelectValue) => void;
};

export function MobileSortSelect({ value, onChange }: Props) {
    const [open, setOpen] = useState(false);
    const t = useTranslations('frontend')

    const options = [
        { value: "latest", label: "category.sort.latest" },
        { value: "price_asc", label: "category.sort.price_asc" },
        { value: "price_desc", label: "category.sort.price_desc" },
    ] as const;
    const selected = options.find(option => option.value === value);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-9 rounded-2xl border border-input bg-background px-3 shadow-xs hover:bg-accent"
                    >
                    <ArrowUpDown className="mr-2 h-4 w-4 text-muted-foreground" />
                    {t(selected?.label || "category.sort.latest")}
                </Button>
            </SheetTrigger>

            <SheetContent side="bottom" className="rounded-none">
                <BottomSheetHeader>{t('category.sort.header')}</BottomSheetHeader>

                <Separator />

                <div className="py-2">
                    {options.map((option) => (
                        <Button
                            key={option.value}
                            variant={value === option.value ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => {
                                onChange(option.value);
                                setOpen(false);
                            }}
                        >
                            {t(option.label)}
                        </Button>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    );
}
