import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from 'next-intl'
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Settings } from "@/types/settings";
import { Locale } from "@/i18n/config";

export function ContactComponent({settings, locale}: {settings: Settings, locale: string}) {
    const t = useTranslations('frontend')

    const addressKey: keyof Settings = `store.fe_address.${locale as Locale}`;
    const address = settings[addressKey];

    return (
        <div className="mx-auto max-w-5xl py-4 lg:py-10">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold">
                    {t('footer.contact_us_section.header')}
                </h1>

                <p className="mt-4 text-muted-foreground">
                    {t('footer.contact_us_section.description')}
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <Mail className="mb-2 h-8 w-8 text-primary" />
                        <CardTitle>{t('footer.contact_us_section.email')}</CardTitle>
                    </CardHeader>

                    <CardContent>
                        {settings?.["store.fe_email"] && settings?.["store.fe_email"] !== '' &&
                            <a
                                href={'mailto:' + settings?.["store.fe_email"]}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                {settings?.["store.fe_email"]}
                            </a>
                        }
                    </CardContent>
                </Card>

                {settings?.["store.fe_phone"] && settings?.["store.fe_phone"] !== '' &&
                    <Card>
                        <CardHeader>
                            <Phone className="mb-2 h-8 w-8 text-primary" />
                            <CardTitle>{t('footer.contact_us_section.phone')}</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <a
                                href={'tel:' + settings?.["store.fe_phone"]}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                {settings?.["store.fe_phone"]}
                            </a>
                        </CardContent>
                    </Card>
                }

                <Card>
                    <CardHeader>
                        <Clock className="mb-2 h-8 w-8 text-primary" />
                        <CardTitle>{t('footer.contact_us_section.working_hours')}</CardTitle>
                    </CardHeader>

                    <CardContent className="text-muted-foreground">
                        <p>{t('footer.contact_us_section.monday')} – {t('footer.contact_us_section.friday')}</p>
                        <p>09:00 – 18:00</p>
                    </CardContent>
                </Card>
            </div>

            {address && (
                <div className="mt-10 text-center">
                    <MapPin className="mx-auto mb-3 h-8 w-8 text-primary" />

                    <h2 className="text-xl font-semibold">
                        {t("footer.contact_us_section.address")}
                    </h2>

                    <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                        {address}
                    </p>
                </div>
            )}

            {/* TODO: add contact form */}
        </div>
    );
}
