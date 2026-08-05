"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { CardContent } from "@/components/ui/card"
import { Order } from "@/types/order"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrderDrawerMainFields } from "./OrderDrawerMainFields"
import { OrderDrawerCustomerFields } from "./OrderDrawerCustomerFields"
import { Field, FieldGroup } from "@/components/ui/field"
import { OrderDrawerShippingFields } from "./OrderDrawerShippingFields"
import { OrderDrawerPaymentFields } from "./OrderDrawerPaymentFields"
import { OrderDrawerItemsFields } from "./OrderDrawerItemsFields"
import { PriceRenderer } from "@/components/custom/PriceRenderer"
import { toast } from "sonner";
import { cancelOrder, checkOrderDsStatus, sendOrder, simulatePayOrder } from "@/lib/api/orders"
import { CancelOrderButton } from "./CancelOrderButton"
import { SimulatePayOrderButton } from "./SimulatePayOrderButton"

export function OrderDrawer({
  open,
  onOpenChange,
  order,
  onRefresh
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  order: Order | null
  onRefresh: () => void
}) {
    const [isSendOrder, setIsSendOrder] = useState(false)
    const [errorSendOrder, setErrorSendOrder] = useState<string | null>(null)
    const [isCheckDsOrder, setIsCheckDsOrder] = useState(false)
    const [errorCheckDsOrder, setErrorCheckDsOrder] = useState<string | null>(null)
    const [isCancelOrder, setIsCancelOrder] = useState(false)
    const [errorCancelOrder, setErrorCancelOrder] = useState<string | null>(null)
    const [isSimulatePayOrder, setIsSimulatePayOrder] = useState(false)
    const [errorSimulatePayOrder, setErrorSimulatePayOrder] = useState<string | null>(null)

    const handleSendOrder = async () => {
        if (!order) return
        setErrorSendOrder(null)
        try {
            setIsSendOrder(true)

            // send order to DS
            const res = await sendOrder(order.id);

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
                        toast.error(errorJson.errors || 'Unknown API error');
                        return;
                    }
                } else {
                    // HTML / text response → system-level issue (not for client)
                    const rawText = await res.text();
                    setErrorSendOrder(rawText.slice(0, 400))
                    return;
                }
            }

            toast.success("Order sent to DS provider successfully");
            await onRefresh()
            setIsSendOrder(true)
        } catch (e) {
            setErrorSendOrder("Status update failed" + e)
        } finally {
            setIsSendOrder(false)
        }
    }

    const handleCheckDsStatus = async () => {
        if (!order) return
        setErrorCheckDsOrder(null)
        try {
            setIsCheckDsOrder(true)

            // check order status in DS provider
            const res = await checkOrderDsStatus(order.id);

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
                        toast.error(errorJson.message || 'Unknown API error');
                        return;
                    }
                } else {
                    // HTML / text response → system-level issue (not for client)
                    const rawText = await res.text();
                    setErrorCheckDsOrder(rawText.slice(0, 400));
                    return;
                }
            }

            toast.success("Status updated");

            await onRefresh()
            setIsCheckDsOrder(true)
        } catch (e) {
            setErrorCheckDsOrder("Status update failed" + e)
        } finally {
            setIsCheckDsOrder(false)
        }
    }

    const handleCancelOrder = async () => {
        if (!order) return
        setErrorCancelOrder(null)
        try {
            setIsCancelOrder(true)

            const res = await cancelOrder(order.id);

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
                        toast.error(errorJson.message || 'Unknown API error');
                        return;
                    }
                } else {
                    // HTML / text response → system-level issue (not for client)
                    const rawText = await res.text();
                    setErrorCancelOrder(rawText.slice(0, 400));
                    return;
                }
            }

            toast.success("Order cancelled");

            await onRefresh()
            setIsCancelOrder(true)
        } catch (e) {
            setErrorCancelOrder("Cancel order failed" + e)
        } finally {
            setIsCancelOrder(false)
        }
    }

    const handleSimulatePayOrder = async () => {
        if (!order) return
        setErrorSimulatePayOrder(null)
        try {
            setIsSimulatePayOrder(true)

            const res = await simulatePayOrder(order.id);

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
                        toast.error(errorJson.message || 'Unknown API error');
                        return;
                    }
                } else {
                    // HTML / text response → system-level issue (not for client)
                    const rawText = await res.text();
                    setErrorSimulatePayOrder(rawText.slice(0, 400));
                    return;
                }
            }

            toast.success("Simulate payment success");

            await onRefresh()
            setIsSimulatePayOrder(true)
        } catch (e) {
            setErrorSimulatePayOrder("Simulate pay order failed" + e)
        } finally {
            setIsSimulatePayOrder(false)
        }
    }

    if (errorSendOrder) {
        toast.error(errorSendOrder)
        setErrorSendOrder(null)
    }

    if (errorCheckDsOrder) {
        toast.error(errorCheckDsOrder)
        setErrorCheckDsOrder(null)
    }

    if (errorCancelOrder) {
        toast.error(errorCancelOrder)
        setErrorCancelOrder(null)
    }

    if (errorSimulatePayOrder) {
        toast.error(errorSimulatePayOrder)
        setErrorSimulatePayOrder(null)
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent style={{ maxWidth: '40vw' }}>
            <SheetHeader>
            <SheetTitle>Order details (ID: {order ? order.id : ''})</SheetTitle>
            </SheetHeader>

            {order && (
                <CardContent className="space-y-4">
                    <Button onClick={handleSendOrder} disabled={isSendOrder}>
                        {isSendOrder && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSendOrder ? "Sending..." : "Send order to DS provider"}
                    </Button>
                    <Button onClick={handleCheckDsStatus} disabled={isCheckDsOrder}>
                        {isCheckDsOrder && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isCheckDsOrder ? "Checking..." : "Check order status in DS provider"}
                    </Button>
                    <CancelOrderButton
                        order={order}
                        handler={handleCancelOrder}
                        isCheck={isCancelOrder}
                    />
                    <SimulatePayOrderButton
                        order={order}
                        handler={handleSimulatePayOrder}
                        isCheck={isSimulatePayOrder}
                    />
                    <div className="flex space-x-4">
                        <FieldGroup className="flex flex-col gap-4 min-w-0">
                            <Field className="gap-1">
                                <div className="text-md text-muted-foreground">
                                    Order Number: {order.order_number}
                                </div>
                            </Field>
                            <Field className="gap-1">
                                <div className="text-md text-muted-foreground">
                                    Total cost: <PriceRenderer value={order.total} />
                                </div>
                            </Field>
                        </FieldGroup>
                    </div>
                    <Tabs defaultValue="main">
                        <TabsList variant="line" className="mb-5">
                            <TabsTrigger value="main">Main</TabsTrigger>
                            <TabsTrigger value="customer">Customer</TabsTrigger>
                            <TabsTrigger value="shipping">Shipping</TabsTrigger>
                            <TabsTrigger value="payment">Payment</TabsTrigger>
                            <TabsTrigger value="items">Items</TabsTrigger>
                        </TabsList>
                        <TabsContent value="main">
                            <OrderDrawerMainFields order={order} />
                        </TabsContent>
                        <TabsContent value="customer">
                            <OrderDrawerCustomerFields order={order} />
                        </TabsContent>
                        <TabsContent value="shipping">
                            <OrderDrawerShippingFields order={order}/>
                        </TabsContent>
                        <TabsContent value="payment">
                            <OrderDrawerPaymentFields order={order} />
                        </TabsContent>
                        <TabsContent value="items">
                            <OrderDrawerItemsFields order={order} />
                        </TabsContent>
                        </Tabs>
                </CardContent>
            )}
        </SheetContent>
        </Sheet>
    )
}
