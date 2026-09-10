import { HeroCarousel } from "@/components/frontend/main/hero-carousel";
import { CategoriesSection } from "@/components/frontend/main/categories-section";
import SmMegaMenu from "@/components/frontend/megamenu/sm-mega-menu";
import { getSettings } from "@/actions/settingsActions";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSettings();
    const t = await getTranslations('frontend');

    const storeName = (settings?.["store.name"] && settings?.["store.name"] !== '') ? ' | ' + settings?.["store.name"] : '';

    return {
        title: t('main.meta_title') + storeName,
        description: t('main.meta_description'),
    };
}

export default function HomePage() {
    return (
        <div className="space-y-6 mb-12">
            <HeroCarousel />
            <SmMegaMenu />
            <CategoriesSection />
        </div>
    );
}
