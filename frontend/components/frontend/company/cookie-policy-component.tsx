'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cookie, Settings2, Eye, ShieldCheck } from "lucide-react";
import { useTranslations } from 'next-intl'

export function CookiePolicyComponent() {
    const t = useTranslations('frontend')

    return (
        <div className="mx-auto max-w-5xl py-4 lg:py-10">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold">
                    {t('footer.cookie_policy_section.header')}
                </h1>

                <p className="mt-4 text-muted-foreground">
                    {t('footer.cookie_policy_section.description')}
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <Cookie className="mb-2 h-8 w-8 text-primary" />
                        <CardTitle>{t('footer.cookie_policy_section.what')}</CardTitle>
                    </CardHeader>

                    <CardContent className="text-muted-foreground">
                        {t('footer.cookie_policy_section.what_description')}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <Settings2 className="mb-2 h-8 w-8 text-primary" />
                        <CardTitle>{t('footer.cookie_policy_section.use')}</CardTitle>
                    </CardHeader>

                    <CardContent className="text-muted-foreground">
                        {t('footer.cookie_policy_section.use_description')}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <Eye className="mb-2 h-8 w-8 text-primary" />
                        <CardTitle>{t('footer.cookie_policy_section.manage')}</CardTitle>
                    </CardHeader>

                    <CardContent className="text-muted-foreground">
                        {t('footer.cookie_policy_section.manage_description')}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <ShieldCheck className="mb-2 h-8 w-8 text-primary" />
                        <CardTitle>{t('footer.cookie_policy_section.your_privacy')}</CardTitle>
                    </CardHeader>

                    <CardContent className="text-muted-foreground">
                        {t('footer.cookie_policy_section.your_privacy_description')}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
