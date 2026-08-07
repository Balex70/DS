import { CustomerMenu } from "./customer/customer-menu";
import { Link } from "@/i18n/navigation";
import { MegaMenu } from "./megamenu/mega-menu";
import { CartButton } from "./cart/cart-button";
import { Search } from "./search/Search";
import HeaderSwitcher from "./switcher/header-switcher";
import { MobileSearch } from "./search/mobile-search";
import Image from "next/image";
import MbMegaMenu from "./megamenu/md-mega-menu";

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
                py-1
                md:h-16
                md:flex-nowrap
                md:py-0">

                {/* Logo */}
                <div className="order-2 shrink-0 sm:order-none">
                    <Link href="/">
                        {/* Desktop */}
                        <Image
                            src="/logo.svg"
                            alt="CJ Store"
                            width={55}
                            height={55}
                            className="hidden md:block"
                            priority
                        />

                        {/* Mobile */}
                        <Image
                            src="/mobile_logo.svg"
                            alt="CJ Store mobile"
                            width={50}
                            height={50}
                            className="block md:hidden"
                            priority
                        />
                    </Link>
                </div>

                {/* Mega menu */}
                <div className="hidden lg:block shrink-0">
                    <MegaMenu />
                </div>
                <div className="hidden md:block lg:hidden shrink-0">
                    <MbMegaMenu />
                </div>

                {/* Search */}
                <div className="hidden md:flex flex-1 min-w-0 order-none">
                    <Search />
                </div>
                <div className="flex flex-1 min-w-0 order-3 md:hidden">
                    <MobileSearch />
                </div>

                {/* Right actions */}
                <div className="ml-auto flex items-center gap-2">
                    <div className="hidden md:flex items-center gap-2">
                        <HeaderSwitcher />
                        <CustomerMenu />
                        <CartButton />
                    </div>
                </div>
            </div>
        </header>
    );
}
