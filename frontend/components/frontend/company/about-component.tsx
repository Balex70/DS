import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WhyChooseUs } from "./why-choose-us";
import { CallToAction } from "./call-to-action";
import { useTranslations } from 'next-intl'
import { MapPin } from "lucide-react";
import { Settings } from "@/types/settings";
import { Locale } from "@/i18n/config";

export function AboutComponent({settings, locale}: {settings: Settings, locale: string}) {
    const t = useTranslations('frontend')

    const addressKey: keyof Settings = `store.fe_address.${locale as Locale}`;
    const address = settings[addressKey];

    return (
        <div className="mx-auto py-4 lg:py-10">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold">
                    {t('footer.about_us_section.header')}
                </h1>

                <p className="mx-auto mt-4 max-w-3xl text-muted-foreground">
                    {t('footer.about_us_section.short_description')}
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('footer.about_us_section.our_story.header')}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <p>
                        {t('footer.about_us_section.our_story.story_1')}
                    </p>
                    <p>
                        {t('footer.about_us_section.our_story.story_2')}
                    </p>
                    <p>
                        {t('footer.about_us_section.our_story.story_3')}
                    </p>
                </CardContent>
            </Card>

            <WhyChooseUs />

            <section className="py-12">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold">
                        {t("footer.about_us_section.where_to_find_us.header")}
                    </h2>

                    {address && (
                        <div className="mt-6 flex flex-col items-center">
                            <MapPin className="mb-3 h-8 w-8 text-primary" />

                            <p className="text-muted-foreground">
                                {address}
                            </p>
                        </div>
                    )}
                </div>
            </section>

            <section className="py-12">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl font-bold">
                        {t('footer.about_us_section.our_mission.header')}
                    </h2>

                    <p className="mt-6 leading-7 text-muted-foreground">
                        {t('footer.about_us_section.our_mission.text_1')}
                    </p>

                    <p className="mt-4 leading-7 text-muted-foreground">
                        {t('footer.about_us_section.our_mission.text_2')}
                    </p>
                </div>
            </section>

            <CallToAction />
        </div>
    );
}
