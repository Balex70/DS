'use client';

import { CustomerMenu } from "./customer-menu";
import BottomSwitcher from "./switcher/bottom-switcher";

export function MobileBottomBar() {
    return (
        <div className="
            fixed
            inset-x-0
            bottom-0
            z-50
            flex
            h-16
            border-t
            border-border
            bg-background
            shadow-[0_-2px_8px_rgba(0,0,0,0.08)]
            md:hidden
            pb-[env(safe-area-inset-bottom)]
            ">
            <BottomSwitcher />
            <CustomerMenu />
        </div>
    );
}
