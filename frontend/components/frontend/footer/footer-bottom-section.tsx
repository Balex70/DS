import Image from "next/image";

function TrustImage({ src, alt }) {
    return (
        <Image
            src={src}
            alt={alt}
            width={60}
            height={60}
            className="object-contain"
            />
    );
}

export default function FooterBottomSection() {
    return (
        <div className="border-t mb-8 md:mb-2">
            <div className="flex flex-col items-center justify-between mt-2 gap-2 lg:flex-row">
                {/* Copyright */}
                <p className="text-center text-xs text-muted-foreground lg:text-left">
                    © {new Date().getFullYear()} `name of the store`. All rights reserved.
                </p>

                {/* Payment / Trust */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
                    <TrustImage src="/footer/verified_by_visa.svg" alt="Verified by Visa" />
                    <TrustImage src="/footer/mastercard_secure_code.svg" alt="Mastercard Secure Code" />
                    <TrustImage src="/footer/apple_pay.svg" alt="Apple Pay" />
                    <TrustImage src="/footer/google_pay.svg" alt="Google Pay" />
                    <TrustImage src="/footer/ssl_secured.svg" alt="SSL Secured" />
                </div>

                {/* Social */}
                {/* <div className="flex items-center gap-4">
                    <Link
                        href="#"
                        aria-label="Facebook"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <Check className="h-5 w-5" />
                    </Link>

                    <Link
                        href="#"
                        aria-label="Instagram"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <Check className="h-5 w-5" />
                    </Link>

                    <Link
                        href="#"
                        aria-label="YouTube"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <Check className="h-5 w-5" />
                    </Link>
                </div> */}
            </div>
        </div>
    );
}
