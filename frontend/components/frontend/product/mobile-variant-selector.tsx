'use client';

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import BottomSheetHeader from "../bottom-sheet-header";
import { ProductVariant } from "@/types/product";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
    variants: ProductVariant[],
    selectedVariant: ProductVariant,
    setSelectedVariantId: (id: number) => void
}

export default function MobileVariantSelector({
    variants,
    selectedVariant,
    setSelectedVariantId
}: Props) {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-9 rounded-2xl border border-input bg-background px-3 shadow-xs hover:bg-accent"
                    >
                    {selectedVariant.key}
                </Button>
            </SheetTrigger>

            <SheetContent side="bottom" className="!h-dvh max-h-dvh w-full rounded-none">
                <BottomSheetHeader>Select</BottomSheetHeader>
                
                <Separator className="my-0" />

                {/* CONTENT */}
                <div className="flex-1 overflow-y-auto py-2">
                    {variants.map((variant) => {
                        const selected = variant.id === selectedVariant.id;

                        return (
                            <button
                                key={variant.id}
                                onClick={() => {
                                    setSelectedVariantId(Number(variant.id));
                                    setOpen(false);
                                }}
                                className={cn(
                                    "flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition-colors",
                                    selected
                                        ? "bg-accent"
                                        : "hover:bg-accent"
                                )}
                            >
                                <span>{variant.key}</span>

                                {selected && (
                                    <Check className="size-5 text-primary" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </SheetContent>
        </Sheet>
    );
}
