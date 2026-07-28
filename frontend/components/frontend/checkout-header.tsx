import Link from "next/link";
import Image from "next/image";

export function CheckoutHeader() {
    return (
        <header className="top-0 z-50 border-b bg-background/95 backdrop-blur">
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
            </div>
        </header>
    );
}
