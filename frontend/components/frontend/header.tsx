import { CustomerMenu } from "./customer-menu";
import Link from "next/link";
import { MegaMenu } from "./megamenu/mega-menu";
import { CartButton } from "./cart/cart-button";
import { Search } from "./search/Search";
import HeaderSwitcher from "./switcher/header-switcher";

export function Header() {
    return (
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
            <div className="
                container
                mx-auto
                flex
                h-auto
                flex-wrap
                items-center
                gap-3
                px-4
                py-3
                md:h-16
                md:flex-nowrap
                md:py-0">

                {/* Logo */}
                <div className="text-xl font-bold">
                    <Link href="/">
                        <h3>CJ Store</h3>
                    </Link>
                </div>

                {/* Mega menu */}
                <div className="shrink-0">
                    <MegaMenu />
                </div>

                {/* Search */}
                <div className="order-last w-full md:order-none md:flex-1">
                    <Search />
                </div>

                {/* Right actions */}
                <div className="ml-auto flex items-center gap-2">
                    <div className="hidden md:flex items-center gap-2">
                        <HeaderSwitcher />
                        <CustomerMenu />
                    </div>

                    <CartButton />
                </div>
            </div>
        </header>
    );
}
