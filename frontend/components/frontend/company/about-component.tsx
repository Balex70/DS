'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WhyChooseUs } from "./why-choose-us";
import { CallToAction } from "./call-to-action";
import { useTranslations } from 'next-intl'

export function AboutComponent() {
    const t = useTranslations('frontend')

    return (
        <div className="container py-2">
            <div className="mb-12">
                <h1 className="text-4xl font-bold">
                    {t('footer.about_us_section.header')}
                </h1>

                <p className="mt-4 max-w-3xl text-muted-foreground">
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
                        {t('footer.about_us_section.our_story.story_2')}
                    </p>
                </CardContent>
            </Card>

            <WhyChooseUs />

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
