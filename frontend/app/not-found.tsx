import { getSettings } from "@/actions/settingsActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Search } from "lucide-react";
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
};

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSettings();
    const t = await getTranslations('frontend');

    const storeName = (settings?.["store.name"] && settings?.["store.name"] !== '') ? ' | ' + settings?.["store.name"] : '';

    return {
        title: t('page_404.meta_title') + storeName,
        description: t('page_404.meta_description'),
    };
}

export default async function NotFound() {
    const locale = await getLocale();

    const t = await getTranslations({
        locale,
        namespace: "frontend",
    });

    return (
        <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
            <Card className="w-full max-w-lg border-0 shadow-none">
                <CardContent className="flex flex-col items-center text-center">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                        <Search className="h-9 w-9 text-muted-foreground" />
                    </div>

                    <p className="text-8xl font-bold tracking-tight text-muted-foreground/30">
                        404
                    </p>

                    <h1 className="-mt-4 text-2xl font-bold tracking-tight sm:text-3xl text-muted-foreground">
                        {t('page_404.title')}
                    </h1>

                    <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
                        {t('page_404.description')}
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Button asChild>
                            <Link href="/">
                                <Home className="mr-2 h-4 w-4" />
                                {t('page_404.back_to_home')}
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
