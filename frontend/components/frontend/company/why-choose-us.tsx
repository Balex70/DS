import {
    CreditCard,
    Headset,
    PackageCheck,
    Truck,
} from "lucide-react";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { useTranslations } from 'next-intl'

const features = [
    {
        icon: Truck,
        title: 'footer.about_us_section.why_choose_us.reason_1_title',
        description: 'footer.about_us_section.why_choose_us.reason_1_description',
    },
    {
        icon: CreditCard,
        title: 'footer.about_us_section.why_choose_us.reason_2_title',
        description: 'footer.about_us_section.why_choose_us.reason_2_description',
    },
    {
        icon: PackageCheck,
        title: 'footer.about_us_section.why_choose_us.reason_3_title',
        description: 'footer.about_us_section.why_choose_us.reason_3_description',
    },
    {
        icon: Headset,
        title: 'footer.about_us_section.why_choose_us.reason_4_title',
        description: 'footer.about_us_section.why_choose_us.reason_4_description',
    },
];

export function WhyChooseUs() {
    const t = useTranslations('frontend')

    return (
        <section className="py-12">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold">{t('footer.about_us_section.why_choose_us.header')}</h2>

                <p className="mt-3 text-muted-foreground">
                    {t('footer.about_us_section.why_choose_us.description')}
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {features.map((feature) => {
                    const Icon = feature.icon;

                    return (
                        <Card key={feature.title}>
                            <CardContent className="flex flex-col items-center p-6 text-center">
                                <Icon className="mb-4 h-10 w-10 text-primary" />

                                <h3 className="mb-2 font-semibold">
                                    {t(feature.title)}
                                </h3>

                                <p className="text-sm text-muted-foreground">
                                    {t(feature.description)}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </section>
    );
}
