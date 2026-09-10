import { getSettings } from "@/actions/settingsActions";
import { PrivacyPolicyComponent } from "@/components/frontend/company/privacy-policy-component";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSettings();
    const t = await getTranslations('frontend');

    const storeName = (settings?.["store.name"] && settings?.["store.name"] !== '') ? ' | ' + settings?.["store.name"] : '';

    return {
        title: t('footer.privacy_policy_section.meta_title') + storeName,
        description: t('footer.privacy_policy_section.meta_description'),
    };
}

export default async function PrivacyPolicyPage() {
    return (
        <div className="container mx-auto px-0 sm:px-4 py-0">
            <PrivacyPolicyComponent />
        </div>
    );
}
