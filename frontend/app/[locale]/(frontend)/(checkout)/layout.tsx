import { CheckoutHeader } from "@/components/frontend/checkout-header";
import { CurrencyContextWrapper } from "@/context/CurrencyContextWrapper";
import { QueryProvider } from "@/providers/query-provider";
import { NextIntlClientProvider } from 'next-intl';

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <NextIntlClientProvider>
            <CurrencyContextWrapper>
                <QueryProvider>
                    <div className="min-h-screen bg-background">
                        <CheckoutHeader />
                        <div className="container mx-auto px-4 py-6">
                            {children}
                        </div>
                    </div>
                </QueryProvider>
            </CurrencyContextWrapper>
        </NextIntlClientProvider>
    );
}
