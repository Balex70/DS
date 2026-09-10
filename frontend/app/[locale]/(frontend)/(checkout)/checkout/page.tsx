import { getSettings } from "@/actions/settingsActions";
import { CheckoutComponent } from "@/components/frontend/checkout/checkout-component";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSettings();
    const t = await getTranslations('frontend');

    const storeName = (settings?.["store.name"] && settings?.["store.name"] !== '') ? ' | ' + settings?.["store.name"] : '';

    return {
        title: t('checkout.meta_title') + storeName,
        description: t('checkout.meta_description'),
    };
}

export default async function CheckoutPage() {
    return (
        <div className="container mx-auto mb-2">
            <CheckoutComponent />
        </div>
    );
}
