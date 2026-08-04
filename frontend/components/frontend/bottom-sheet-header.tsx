'use client';

import { Button } from "@/components/ui/button";

import { X } from "lucide-react";
import { SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export default function BottomSheetHeader({children}: { children: React.ReactNode }) {
    return (
        <SheetHeader className="pb-0">
            <div className="flex items-center justify-between">
                <SheetTitle className="inline-flex items-center">
                    {children}
                </SheetTitle>

                <SheetClose asChild>
                    <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                    >
                        <X className="!h-6 !w-6" />
                    </Button>
                </SheetClose>
            </div>
        </SheetHeader>
    );
}
