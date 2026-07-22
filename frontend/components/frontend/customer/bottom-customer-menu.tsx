import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { User, X } from "lucide-react";

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
                <SheetHeader className="pb-0">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="inline-flex items-center">
                            Customer
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
