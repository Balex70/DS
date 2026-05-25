import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export function CartButton() {
    return (
        <Button
            variant="outline"
            size="icon"
            className="relative"
        >
            <ShoppingCart className="h-5 w-5" />

            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                0
            </span>
        </Button>
    );
}
