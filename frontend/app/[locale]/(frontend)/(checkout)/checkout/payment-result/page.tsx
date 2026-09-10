import { getSettings } from "@/actions/settingsActions";
import { CheckoutPaymentResultComponent } from "@/components/frontend/checkout/payment-result-component";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSettings();
    const t = await getTranslations('frontend');

    const storeName = (settings?.["store.name"] && settings?.["store.name"] !== '') ? ' | ' + settings?.["store.name"] : '';

    return {
        title: t('checkout.payment_result.meta_title') + storeName,
        description: t('checkout.payment_result.meta_description'),
    };
}

type Props = {
    searchParams: Promise<{
        token?: string;
    }>;
};

export default async function CheckoutPaymentResultPage({searchParams}: Props) {
    const { token } = await searchParams
    return (
        <div className="container mx-auto px-0 sm:px-4 py-0">
            <CheckoutPaymentResultComponent token={token} />
        </div>
    );
}
