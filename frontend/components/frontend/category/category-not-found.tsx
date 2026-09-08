"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from 'next-intl';

export function CategoryNotFound() {
    const t = useTranslations('frontend')
    return (
        <div className="min-w-0 flex-1">
            <Card className="mx-auto w-full max-w-5xl overflow-hidden border-border/60 bg-background shadow-sm">
                <CardContent className="flex min-h-[360px] flex-col items-center justify-center px-6 py-12 text-center">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                        <AlertCircle className="h-10 w-10 text-muted-foreground" />
                    </div>

                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                        {t('category.category_not_found')}
                    </h2>

                    <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                        {t('category.category_not_found_description')}
                    </p>

                    <Button
                        className="mt-6"
                        variant="outline"
                        asChild
                    >
                        <Link href="/">
                            {t('to_home_button')}
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
