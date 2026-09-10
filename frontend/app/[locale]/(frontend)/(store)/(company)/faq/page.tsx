import { getSettings } from "@/actions/settingsActions";
import { FAQComponent } from "@/components/frontend/company/faq-component";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSettings();
    const t = await getTranslations('frontend');

    const storeName = (settings?.["store.name"] && settings?.["store.name"] !== '') ? ' | ' + settings?.["store.name"] : '';

    return {
        title: t('footer.faq_section.meta_title') + storeName,
        description: t('footer.faq_section.meta_description'),
    };
}

export default async function FAQPage() {
    return (
        <div className="container mx-auto px-0 sm:px-4 py-0">
            <FAQComponent />
        </div>
    );
}
