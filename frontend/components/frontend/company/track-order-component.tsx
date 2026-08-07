'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTranslations } from 'next-intl'
import { PackageSearch, TriangleAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { useRef, useState } from "react";
import { TrackingInfo } from "@/types/order";
import { getOrderTrackInfo } from "@/services/order-service";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const Field = ({
    title,
    field
}: {
    title: string,
    field: string
}) => {
    return (
        <div>
            <p className="text-sm text-muted-foreground">
                {title}
            </p>

            <p className="font-medium">
                {field}
            </p>
        </div>
    )
}
export function TrackOrderComponent() {
    const [tracking, setTracking] = useState<TrackingInfo | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [errorTrackInfo, setErrorTrackInfo] = useState<string | null>(null)
    const trackNumberRef = useRef<HTMLInputElement>(null)
    const t = useTranslations('frontend')
    
    const handleTrackInfo = async (trackNumber: string) => {
        setErrorTrackInfo(null)
        setTracking(null)
        try {
            setIsLoading(true)

            const trackData = await getOrderTrackInfo(trackNumber);

            if (
                !trackData || 
                (Array.isArray(trackData) && trackData.length === 0) ||
                (typeof trackData === 'object' && Object.keys(trackData).length === 0)
            ) {
                setTracking(null);
                setErrorTrackInfo("Error");
                return;
            }

            setTracking(trackData)
            setIsLoading(false)
        } catch (e) {
            setErrorTrackInfo("Error")
        } finally {
            setIsLoading(false)
            // Clear the input
            if (trackNumberRef.current) {
                trackNumberRef.current.value = "";
            }
        }
    }

    return (
        <div className="mx-auto max-w-3xl py-4 lg:py-10">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold">
                    {t('footer.track_order.header')}
                </h1>

                <p className="mt-4 text-muted-foreground">
                    {t('footer.track_order.description')}
                </p>
            </div>

            <Card className="py-3 sm:py-6 ">
                <CardHeader className="flex flex-row items-center text-center">
                    <div className="flex items-center gap-4 w-full max-w-xs">
                        <PackageSearch className="h-12 w-12 shrink-0 text-primary" />

                        <div className="flex-1">
                            {isLoading ? (
                                <>
                                    <Skeleton className="h-2 w-full rounded-full" />
                                    <p className="mt-2 animate-pulse text-left text-xs text-muted-foreground">
                                        {t('footer.track_order.looking_up')}
                                    </p>
                                </>
                            ) : (
                                <div className="h-[26px]" />
                            )}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="px-2 sm:px-6 space-y-4">
                    {errorTrackInfo && (
                        <Alert className="mt-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
                            <TriangleAlert className="h-4 w-4 !text-yellow-500" />

                            <AlertTitle>{t('footer.track_order.alert_label')}</AlertTitle>

                            <AlertDescription className="space-y-3">
                                <p>
                                    {t('footer.track_order.alert_message')}
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
                    )}
                    
                    {tracking && (
                        <Card>
                            <CardContent className="px-3 sm:px-6">
                                <div className="space-y-6">

                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                {t('footer.track_order.tracking_number')}
                                            </p>

                                            <p className="font-semibold break-all">
                                                {tracking.trackingNumber}
                                            </p>
                                        </div>

                                        <Badge
                                            variant="secondary"
                                            className={`
                                                ${
                                                    tracking.trackingStatus === "In transit"
                                                        ? "text-white bg-green-500"
                                                        : "text-white bg-yellow-500"
                                                }
                                            `}
                                            >
                                            {tracking.trackingStatus}
                                        </Badge>
                                    </div>

                                    <Separator />

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <Field title={t('footer.track_order.shipping_method')} field={tracking.logisticName}/>
                                        <Field title={t('footer.track_order.estimated_delivery')} field={tracking.deliveryDay + ' ' + t('footer.track_order.days')}/>
                                        {/* <Field title="Route" field={tracking.trackingFrom + ' → ' + tracking.trackingTo}/> */}
                                        <Field title={t('footer.track_order.last_mile_carrier')} field={tracking.lastMileCarrier}/>
                                        <Field title={t('footer.track_order.last_mile_tracking_number')} field={tracking.lastTrackNumber}/>
                                        <Field title={t('footer.track_order.estimated_delivery_time')} field={tracking.deliveryTime}/>

                                    </div>

                                </div>
                            </CardContent>
                        </Card>
                    )}
                    <Input
                        disabled={isLoading}
                        className="w-full"
                        placeholder={t('footer.track_order.order_number_placeholder')}
                        ref={trackNumberRef}
                    />

                    <Button
                        disabled={isLoading}
                        className="w-full"
                        onClick={() => handleTrackInfo(trackNumberRef.current?.value ?? "")}
                    >
                        {t('footer.track_order.track_button')}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
