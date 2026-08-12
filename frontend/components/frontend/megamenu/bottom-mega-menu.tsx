'use client';

import { Button } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { MobileCatalog } from "./mobile-catalog";
import { useState } from "react";
import BottomSheetHeader from "../bottom-sheet-header";
import { useTranslations } from 'next-intl'

export default function BottomMegaMenu() {
    const [open, setOpen] = useState(false);
    const t = useTranslations('frontend')
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-full flex-1 rounded-none"
                >
                    <div className="flex flex-col items-center gap-1">
                        <LayoutGrid className="h-6 w-6 text-muted-foreground" />

                        <span className="text-xs text-muted-foreground">
                            {t('megamenu.catalog')}
                        </span>
                    </div>
                </Button>
            </SheetTrigger>

            <SheetContent side="bottom" className="!h-dvh max-h-dvh w-full rounded-none">
                <BottomSheetHeader>{t('megamenu.catalog')}</BottomSheetHeader>
                
                <Separator className="my-0" />

                <div className="flex-1 min-h-0">
                    <MobileCatalog onClose={() => setOpen(false)}/>
                </div>
            </SheetContent>
        </Sheet>
    );
}
