'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from 'next-intl'
import { Clock, Mail, Phone } from "lucide-react";

export function ContactComponent() {
    const t = useTranslations('frontend')

    return (
        <div className="container py-4">
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
                        <a
                            href="mailto:support@example.com"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            support@example.com
                        </a>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <Phone className="mb-2 h-8 w-8 text-primary" />
                        <CardTitle>{t('footer.contact_us_section.phone')}</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <a
                            href="tel:+10000000000"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            +1 (000) 000-0000
                        </a>
                    </CardContent>
                </Card>

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
