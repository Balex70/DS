'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from 'next-intl'
import { PackageSearch, TriangleAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

export function TrackOrderComponent() {
    const t = useTranslations('frontend')

    return (
        <div className="container mx-auto max-w-3xl py-4 lg:py-10">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold">
                    {t('footer.track_order.header')}
                </h1>

                <p className="mt-4 text-muted-foreground">
                    {t('footer.track_order.description')}
                </p>
            </div>

            <Card>
                <CardHeader className="items-center text-center">
                    <PackageSearch className="mb-2 h-12 w-12 text-primary" />

                    <CardTitle>{t('footer.track_order.form_header')}</CardTitle>

                    <CardDescription>
                        {t('footer.track_order.form_description')}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <Input
                        disabled
                        placeholder={t('footer.track_order.order_number_placeholder')}
                    />

                    <Input
                        disabled
                        placeholder={t('footer.track_order.email_placeholder')}
                    />

                    <Button
                        disabled
                        className="w-full"
                    >
                        {t('footer.track_order.track_button')}
                    </Button>

                    <Alert className="mt-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
                        <TriangleAlert className="h-4 w-4 !text-yellow-500" />

                        <AlertTitle>{t('footer.track_order.warning_label')}</AlertTitle>

                        <AlertDescription className="space-y-3">
                            <p>
                                {t('footer.track_order.warning_message')}
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full sm:w-auto"
                            >
                                <Link
                                    href="/contact"
                                    className="text-sm text-muted-foreground transition-colors hover:text-foreground !no-underline !hover:no-underline"
                                >
                                    {t('footer.track_order.contact_us_button')}
                                </Link>
                            </Button>
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </div>
    );
}
