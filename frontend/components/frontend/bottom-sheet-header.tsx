'use client';

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface Props {
    children: React.ReactNode;
    className?: string;
}

export default function BottomSheetHeader({ children, className }: Props) {
    return (
        <SheetHeader className="pb-0">
            <div className="flex items-center justify-between">
                <SheetTitle className={cn("inline-flex items-center text-base", className)}>
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
