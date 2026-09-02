'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from 'next-intl'
import { Clock, Mail, Phone } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";
import { Skeleton } from "@/components/ui/skeleton";

export function ContactComponent() {
    const { data: settings, isLoading } = useSettings();
    const t = useTranslations('frontend')

    if (isLoading) {
        return (
            <>
                <div className="mx-auto max-w-5xl py-4 lg:py-10">
                    <div className="mb-10 text-center space-y-2">
                        <Skeleton className="mx-auto h-5 max-w-md" />

                        <Skeleton className="mx-auto h-6 max-w-2xl" />
                    </div>

                    <div className="grid gap-6 md:grid-flow-col">
                        <div className="space-y-3">
                            <Skeleton className="h-9 w-1/6 max-w-md" />
                            <Skeleton className="h-4 w-full max-w-2xl" />
                            <Skeleton className="h-4 w-4/5 max-w-xl" />
                        </div>

                        <div className="space-y-3">
                            <Skeleton className="h-9 w-1/6 max-w-md" />
                            <Skeleton className="h-4 w-full max-w-2xl" />
                            <Skeleton className="h-4 w-4/5 max-w-xl" />
                        </div>

                        <div className="space-y-3">
                            <Skeleton className="h-9 w-1/6 max-w-md" />
                            <Skeleton className="h-4 w-full max-w-2xl" />
                            <Skeleton className="h-4 w-4/5 max-w-xl" />
                        </div>
                    </div>
                </div>
            </>
        )
    }

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
                        <p>Monday – Friday</p>
                        <p>09:00 – 18:00</p>
                    </CardContent>
                </Card>
            </div>
            
            {/* TODO: add contact form */}
        </div>
    );
}
