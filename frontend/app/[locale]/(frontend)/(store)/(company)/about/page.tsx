import { Metadata } from "next";
import { AboutComponent } from "@/components/frontend/company/about-component";
import { getTranslations } from "next-intl/server";
import { getSettings } from "@/actions/settingsActions";

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSettings();
    const t = await getTranslations('frontend');

    const storeName = (settings?.["store.name"] && settings?.["store.name"] !== '') ? ' | ' + settings?.["store.name"] : '';

    return {
        title: t('footer.about_us_section.meta_title') + storeName,
        description: t('footer.about_us_section.meta_description'),
    };
}

export default async function AboutPage() {
    return (
        <div className="container mx-auto px-0 sm:px-4 py-0">
            <AboutComponent />
        </div>
    );
}
