import { getSettings } from "@/actions/settingsActions";
import { PaymentMethodsComponent } from "@/components/frontend/company/payment-methods-component";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSettings();
    const t = await getTranslations('frontend');

    const storeName = (settings?.["store.name"] && settings?.["store.name"] !== '') ? ' | ' + settings?.["store.name"] : '';

    return {
        title: t('footer.payment_methods_section.meta_title') + storeName,
        description: t('footer.payment_methods_section.meta_description'),
    };
}

export default async function PaymentMethodsPage() {
    return (
        <div className="container mx-auto px-0 sm:px-4 py-0">
            <PaymentMethodsComponent />
        </div>
    );
}
