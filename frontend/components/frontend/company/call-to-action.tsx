'use client'

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { useTranslations } from 'next-intl'

export function CallToAction() {
    const t = useTranslations('frontend')

    return (
        <section className="py-12">
            <Card>
                <CardContent className="flex flex-col items-center gap-6 p-8 text-center">
                    <div>
                        <h2 className="text-2xl font-bold">
                            {t('call_to_action.header')}
                        </h2>

                        <p className="mt-3 max-w-2xl text-muted-foreground">
                            {t('call_to_action.description')}
                        </p>
                    </div>

                    <Button asChild size="lg">
                        <Link href="/contact">
                            {t('call_to_action.button_text')}
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </section>
    );
}
