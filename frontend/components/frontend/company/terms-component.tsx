'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ShoppingCart, CreditCard, ShieldAlert } from "lucide-react";
import { useTranslations } from 'next-intl'

export function TermsComponent() {
    const t = useTranslations('frontend')

    return (
        <div className="mx-auto max-w-5xl py-4 lg:py-10">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold">
                    {t('footer.terms_section.header')}
                </h1>

                <p className="mt-4 text-muted-foreground">
                    {t('footer.terms_section.description')}
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <FileText className="mb-2 h-8 w-8 text-primary" />
                        <CardTitle>{t('footer.terms_section.use_website')}</CardTitle>
                    </CardHeader>

                    <CardContent className="text-muted-foreground">
                        {t('footer.terms_section.use_website_description')}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <ShoppingCart className="mb-2 h-8 w-8 text-primary" />
                        <CardTitle>{t('footer.terms_section.orders')}</CardTitle>
                    </CardHeader>

                    <CardContent className="text-muted-foreground">
                        {t('footer.terms_section.orders_description')}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CreditCard className="mb-2 h-8 w-8 text-primary" />
                        <CardTitle>{t('footer.terms_section.payments')}</CardTitle>
                    </CardHeader>

                    <CardContent className="text-muted-foreground">
                        {t('footer.terms_section.payments_description')}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <ShieldAlert className="mb-2 h-8 w-8 text-primary" />
                        <CardTitle>{t('footer.terms_section.limitation')}</CardTitle>
                    </CardHeader>

                    <CardContent className="text-muted-foreground">
                        {t('footer.terms_section.limitation_description')}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
