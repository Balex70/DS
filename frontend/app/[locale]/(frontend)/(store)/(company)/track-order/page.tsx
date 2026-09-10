import { getSettings } from "@/actions/settingsActions";
import { TrackOrderComponent } from "@/components/frontend/company/track-order-component";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSettings();
    const t = await getTranslations('frontend');

    const storeName = (settings?.["store.name"] && settings?.["store.name"] !== '') ? ' | ' + settings?.["store.name"] : '';

    return {
        title: t('footer.track_order.meta_title') + storeName,
        description: t('footer.track_order.meta_description'),
    };
}

export default async function TrackOrderPage() {
    const t = await getTranslations('frontend');

    return (
        <div className="container mx-auto px-0 sm:px-4 py-0">
            <div className="mx-auto max-w-3xl py-4 lg:py-10">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold">
                        {t('footer.track_order.header')}
                    </h1>

                    <p className="mt-4 text-muted-foreground">
                        {t('footer.track_order.description')}
                    </p>
                </div>
                <TrackOrderComponent />
            </div>
        </div>
    );
}
