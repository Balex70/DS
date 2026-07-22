'use client';

import { Button } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { MobileCatalog } from "./mobile-catalog";

export default function BottomMegaMenu() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-full flex-1 rounded-none"
                >
                    <div className="flex flex-col items-center gap-1">
                        <LayoutGrid className="h-6 w-6 text-muted-foreground" />

                        <span className="text-xs text-muted-foreground">
                            Catalog
                        </span>
                    </div>
                </Button>
            </SheetTrigger>

            <SheetContent side="bottom" className="!h-dvh max-h-dvh w-full rounded-none">
                <SheetHeader className="pb-0">
                    <SheetTitle>Catalog</SheetTitle>
                </SheetHeader>
                
                <Separator className="my-0" />

                <div className="flex-1 min-h-0">
                    <MobileCatalog />
                </div>
            </SheetContent>
        </Sheet>
    );
}
