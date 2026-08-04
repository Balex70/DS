'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Shield, UserCheck, Lock } from "lucide-react";
import { useTranslations } from 'next-intl'

export function PrivacyPolicyComponent() {
    const t = useTranslations('frontend')

    return (
        <div className="mx-auto max-w-5xl py-4 lg:py-10">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold">
                    {t('footer.privacy_policy_section.header')}
                </h1>

                <p className="mt-4 text-muted-foreground">
                    {t('footer.privacy_policy_section.description')}
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <Database className="mb-2 h-8 w-8 text-primary" />
                        <CardTitle>{t('footer.privacy_policy_section.collect')}</CardTitle>
                    </CardHeader>

                    <CardContent className="text-muted-foreground">
                        {t('footer.privacy_policy_section.collect_description')}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <UserCheck className="mb-2 h-8 w-8 text-primary" />
                        <CardTitle>{t('footer.privacy_policy_section.use')}</CardTitle>
                    </CardHeader>

                    <CardContent className="text-muted-foreground">
                        {t('footer.privacy_policy_section.use_description')}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <Lock className="mb-2 h-8 w-8 text-primary" />
                        <CardTitle>{t('footer.privacy_policy_section.security')}</CardTitle>
                    </CardHeader>

                    <CardContent className="text-muted-foreground">
                        {t('footer.privacy_policy_section.security_description')}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <Shield className="mb-2 h-8 w-8 text-primary" />
                        <CardTitle>{t('footer.privacy_policy_section.rights')}</CardTitle>
                    </CardHeader>

                    <CardContent className="text-muted-foreground">
                        {t('footer.privacy_policy_section.rights_description')}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
