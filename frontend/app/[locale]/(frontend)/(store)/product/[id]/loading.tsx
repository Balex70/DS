import { getTranslations } from "next-intl/server";

export default async function Loading() {
    const t = await getTranslations('frontend');

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-4 animate-pulse">
                    <div className="h-4 w-3/4 rounded bg-muted" />
                    <div className="h-3 w-1/2 rounded bg-muted" />
                </div>
                <div className="space-y-4 animate-pulse">
                    <div className="h-4 w-3/4 rounded bg-muted" />
                    <div className="h-3 w-1/2 rounded bg-muted" />
                </div>
            </div>
            <div className="w-full space-y-4 animate-pulse pt-6">
                <div className="h-5 w-full rounded bg-muted" />
            </div>
            <p className="mt-2 animate-pulse text-left text-xs text-muted-foreground">
                {t('loading_loader')}
            </p>
        </div>
    );
}
