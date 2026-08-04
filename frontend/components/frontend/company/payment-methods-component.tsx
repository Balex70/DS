'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from 'next-intl'
import { BadgeDollarSign, CreditCard, ShieldCheck, Wallet } from "lucide-react";

export function PaymentMethodsComponent() {
    const t = useTranslations('frontend')

    return (
        <div className="mx-auto max-w-5xl py-4 lg:py-10">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold">
                    {t('footer.payment_methods_section.header')}
                </h1>

                <p className="mt-4 text-muted-foreground">
                    {t('footer.payment_methods_section.description')}
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CreditCard className="mb-2 h-8 w-8 text-primary" />
                        <CardTitle>{t('footer.payment_methods_section.accept')}</CardTitle>
                    </CardHeader>

                    <CardContent className="text-muted-foreground">
                        {t('footer.payment_methods_section.accept_description')}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <ShieldCheck className="mb-2 h-8 w-8 text-primary" />
                        <CardTitle>{t('footer.payment_methods_section.secure')}</CardTitle>
                    </CardHeader>

                    <CardContent className="text-muted-foreground">
                        {t('footer.payment_methods_section.secure_description')}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <Wallet className="mb-2 h-8 w-8 text-primary" />
                        <CardTitle>{t('footer.payment_methods_section.charge')}</CardTitle>
                    </CardHeader>

                    <CardContent className="text-muted-foreground">
                        {t('footer.payment_methods_section.charge_description')}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <BadgeDollarSign className="mb-2 h-8 w-8 text-primary" />
                        <CardTitle>{t('footer.payment_methods_section.currencies')}</CardTitle>
                    </CardHeader>

                    <CardContent className="text-muted-foreground">
                        {t('footer.payment_methods_section.currencies_description')}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
