import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { User } from "lucide-react";
import BottomSheetHeader from "../bottom-sheet-header";

export function BottomCustomerMenu() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-full flex-1 rounded-none"
                >
                    <div className="flex flex-col items-center gap-1">
                        <User className="h-6 w-6 text-muted-foreground" />

                        <span className="text-xs text-muted-foreground">
                            Customer
                        </span>
                    </div>
                </Button>
            </SheetTrigger>

            <SheetContent side="bottom" className="!h-dvh max-h-dvh w-full rounded-none">
                <BottomSheetHeader>Customer</BottomSheetHeader>
                
                <Separator className="my-0" />

                <div className="space-y-6 p-4">
                    <div>
                        <Label>Orders</Label>

                        <p className="text-sm text-muted-foreground">
                            View your orders
                        </p>
                    </div>

                    <div>
                        <Label>My products/обрані товари</Label>

                        <p className="text-sm text-muted-foreground">
                            View your favorite products
                        </p>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
