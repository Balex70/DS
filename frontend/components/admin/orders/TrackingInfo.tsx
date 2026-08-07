"use client"

import { CheckCircle2Icon, Loader2, Truck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Order, TrackingInfo } from "@/types/order"
import { useState } from "react"
import { toast } from "sonner";
import { Button } from "@/components/ui/button"
import { trackInfo } from "@/lib/api/orders"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function TrackingInfoButton({
    order,
}: {
    order: Order | null
}) {
    const [tracking, setTracking] = useState<TrackingInfo | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [errorTrackInfo, setErrorTrackInfo] = useState<string | null>(null)
    const handleTrackInfo = async () => {
        if (!order) return
        setErrorTrackInfo(null)
        try {
            setIsLoading(true)

            const res = await trackInfo(order.id);

            if (!res.ok) {
                const contentType = res.headers.get('content-type') || '';
                if (contentType.includes('application/json')) {
                    const errorJson = await res.json();
                    if (Array.isArray(errorJson.errors)) {
                        errorJson.errors.forEach((error: string, index: number) => {
                            setTimeout(() => toast.error(error), index * 2000);
                        });
                        return;
                    } else {
                        // toast.error(errorJson.message || 'Unknown API error');
                        setErrorTrackInfo(errorJson.message || 'Unknown API error');
                        return;
                    }
                } else {
                    // HTML / text response → system-level issue (not for client)
                    const rawText = await res.text();
                    setErrorTrackInfo(rawText.slice(0, 400));
                    return;
                }
            }

            const json = await res.json()
            const trackData: TrackingInfo = json?.data?.data ?? json?.data ?? [];

            if (
                !trackData || 
                (Array.isArray(trackData) && trackData.length === 0) ||
                (typeof trackData === 'object' && Object.keys(trackData).length === 0)
            ) {
                setTracking(null);
                setErrorTrackInfo("No tracking information found");
                return;
            }

            setTracking(trackData)
            setIsLoading(false)
        } catch (e) {
            setErrorTrackInfo("Track info order failed" + e)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog>
            <DialogTrigger>
                <Button
                    onClick={handleTrackInfo}
                    disabled={isLoading}
                    className="w-full"
                    >
                        <Truck className="mr-2 h-4 w-4" />
                        Get Tracking Information
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Tracking information</DialogTitle>
                </DialogHeader>
                <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
                    {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {errorTrackInfo && (
                        <Alert className="max-w-md">
                            <CheckCircle2Icon />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                {errorTrackInfo}
                            </AlertDescription>
                        </Alert>
                    )}
                    {tracking && (
                        <Card>
                            <CardContent className="pt-6">
                                <div className="space-y-6">

                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Tracking Number
                                            </p>

                                            <p className="font-semibold break-all">
                                                {tracking.trackingNumber}
                                            </p>
                                        </div>

                                        <Badge variant="secondary">
                                            {tracking.trackingStatus}
                                        </Badge>
                                    </div>

                                    <Separator />

                                    <div className="grid gap-4 sm:grid-cols-2">

                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Shipping Method
                                            </p>

                                            <p className="font-medium">
                                                {tracking.logisticName}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Estimated Delivery
                                            </p>

                                            <p className="font-medium">
                                                {tracking.deliveryDay} days
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Route
                                            </p>

                                            <p className="font-medium">
                                                {tracking.trackingFrom} → {tracking.trackingTo}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Last Mile Carrier
                                            </p>

                                            <p className="font-medium">
                                                {tracking.lastMileCarrier}
                                            </p>
                                        </div>

                                        <div className="sm:col-span-2">
                                            <p className="text-xs text-muted-foreground">
                                                Last Mile Tracking Number
                                            </p>

                                            <p className="font-medium break-all">
                                                {tracking.lastTrackNumber}
                                            </p>
                                        </div>

                                        <div className="sm:col-span-2">
                                            <p className="text-xs text-muted-foreground">
                                                Estimated Delivery Time
                                            </p>

                                            <p className="font-medium">
                                                {tracking.deliveryTime}
                                            </p>
                                        </div>

                                    </div>

                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
