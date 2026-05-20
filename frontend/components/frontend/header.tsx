import { SearchBar } from "./search-bar";
import { CustomerMenu } from "./customer-menu";
import { CartButton } from "./cart-button";

export function Header() {
    return (
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
            <div className="container mx-auto flex h-16 items-center gap-4 px-4">
                <div className="text-xl font-bold">
                    CJ Store
                </div>

                <div className="flex-1">
                    <SearchBar />
                </div>

                <div className="flex items-center gap-2">
                    <CustomerMenu />
                    <CartButton />
                </div>
            </div>
        </header>
    );
}
