import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from 'next-intl'
import { Globe, MapPinned, PackageSearch, Truck } from "lucide-react";

export function ShippingInformationComponent() {
    const t = useTranslations('frontend')

    return (
        <div className="mx-auto max-w-5xl py-4 lg:py-10">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold">
                    {t('footer.shipping_section.header')}
                </h1>

                <p className="mt-4 text-muted-foreground">
                    {t('footer.shipping_section.description')}
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <Globe className="mb-2 h-8 w-8 text-primary" />
                        <CardTitle>{t('footer.shipping_section.shipping_coverage')}</CardTitle>
                    </CardHeader>

                    <CardContent className="text-muted-foreground">
                        {t('footer.shipping_section.shipping_coverage_description')}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <Truck className="mb-2 h-8 w-8 text-primary" />
                        <CardTitle>{t('footer.shipping_section.shipping_delivery_time')}</CardTitle>
                    </CardHeader>

                    <CardContent className="text-muted-foreground">
                        {t('footer.shipping_section.shipping_delivery_time_description')}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <MapPinned className="mb-2 h-8 w-8 text-primary" />
                        <CardTitle>{t('footer.shipping_section.shipping_cost')}</CardTitle>
                    </CardHeader>

                    <CardContent className="text-muted-foreground">
                        {t('footer.shipping_section.shipping_cost_description')}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <PackageSearch className="mb-2 h-8 w-8 text-primary" />
                        <CardTitle>{t('footer.shipping_section.shipping_tracking')}</CardTitle>
                    </CardHeader>

                    <CardContent className="text-muted-foreground">
                        {t('footer.shipping_section.shipping_tracking_description')}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
