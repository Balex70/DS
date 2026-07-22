'use client';

import { Separator } from "../ui/separator";
import BottomCart from "./cart/bottom-cart";
import { BottomCustomerMenu } from "./customer/bottom-customer-menu";
import BottomMegaMenu from "./megamenu/bottom-mega-menu";
import BottomSwitcher from "./switcher/bottom-switcher";

export function MobileBottomBar() {
    return (
        <div className="
            fixed
            inset-x-0
            bottom-0
            z-50
            flex
            h-14
            border-t
            border-border
            bg-background/90
            backdrop-blur-md
            shadow-[0_-2px_8px_rgba(0,0,0,0.08)]
            md:hidden
            pb-[env(safe-area-inset-bottom)]
            ">
            <BottomMegaMenu />
            <Separator orientation="vertical" className="!h-10 !self-center" />
            <BottomSwitcher />
            <Separator orientation="vertical" className="!h-10 !self-center" />
            <BottomCustomerMenu />
            <Separator orientation="vertical" className="!h-10 !self-center" />
            <BottomCart />
        </div>
    );
}
