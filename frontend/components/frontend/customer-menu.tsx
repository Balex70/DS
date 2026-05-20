import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export function CustomerMenu() {
    return (
        <Button variant="outline" size="icon">
            <User className="h-5 w-5" />
        </Button>
    );
}
