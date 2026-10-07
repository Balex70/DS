import { Footer } from "@/components/frontend/footer/footer";
import { Header } from "@/components/frontend/header";
import { MobileBottomBar } from "@/components/frontend/mobile-bottom-bar";
import { CurrencyContextWrapper } from "@/context/CurrencyContextWrapper";
import { QueryProvider } from "@/providers/query-provider";
import { NextIntlClientProvider } from 'next-intl';

export default async function Layout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    return (
        <NextIntlClientProvider>
            <CurrencyContextWrapper>
                <QueryProvider>
                    <div className="min-h-screen bg-background">
                        <Header locale={locale} />

                        <div className="container mx-auto px-4 py-6">
                            {children}
                        </div>

                        <MobileBottomBar />
                        <Footer />
                    </div>
                </QueryProvider>
            </CurrencyContextWrapper>
        </NextIntlClientProvider>
    );
}
