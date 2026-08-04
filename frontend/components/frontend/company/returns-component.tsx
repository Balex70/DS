'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from 'next-intl'
import { CreditCard, Headset, PackageX, RotateCcw } from "lucide-react";

export function ReturnsComponent() {
    const t = useTranslations('frontend')

    return (
        <div className="mx-auto max-w-5xl py-4 lg:py-10">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold">
                    {t('footer.returns.header')}
                </h1>

                <p className="mt-4 text-muted-foreground">
                    {t('footer.returns.description')}
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <RotateCcw className="mb-2 h-8 w-8 text-primary" />
                        <CardTitle>{t('footer.returns.return_eligibility')}</CardTitle>
                    </CardHeader>

                    <CardContent className="text-muted-foreground">
                        {t('footer.returns.return_eligibility_description')}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CreditCard className="mb-2 h-8 w-8 text-primary" />
                        <CardTitle>{t('footer.returns.refund_process')}</CardTitle>
                    </CardHeader>

                    <CardContent className="text-muted-foreground">
                        {t('footer.returns.refund_process_description')}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <PackageX className="mb-2 h-8 w-8 text-primary" />
                        <CardTitle>{t('footer.returns.return_damage')}</CardTitle>
                    </CardHeader>

                    <CardContent className="text-muted-foreground">
                        {t('footer.returns.return_damage_description')}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <Headset className="mb-2 h-8 w-8 text-primary" />
                        <CardTitle>{t('footer.returns.return_help')}</CardTitle>
                    </CardHeader>

                    <CardContent className="text-muted-foreground">
                        {t('footer.returns.return_help_description')}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
