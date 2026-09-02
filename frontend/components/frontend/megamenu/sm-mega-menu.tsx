'use client';

import { Button } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { MobileCatalog } from "./mobile-catalog";
import { useState } from "react";
import BottomSheetHeader from "../bottom-sheet-header";
import { useTranslations } from 'next-intl'

export default function SmMegaMenu() {
    const [open, setOpen] = useState(false);
    const t = useTranslations('frontend')

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <div className="flex justify-center md:hidden">
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full gap-2 mb-0"
                    >
                        <LayoutGrid className="h-4 w-4" />
                        {t('megamenu.catalog')}
                    </Button>
                </SheetTrigger>
            </div>

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
