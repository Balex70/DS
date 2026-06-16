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
import { getCookie } from "@/helpers/general"

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
    const [isAction, setIsAction] = useState(false)

    const handleSendOrder = async () => {
        if (!order) return

        try {
            setIsAction(true)

            // get the csrf token
            await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/sanctum/csrf-cookie`, {
                credentials: 'include',
            });

            const csrfToken = getCookie('XSRF-TOKEN');
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-XSRF-TOKEN': csrfToken!
            };

            // payment status update
            await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/api/orders/${order.id}/send`, {
                method: 'POST',
                credentials: 'include',
                headers: headers,
                cache: 'no-cache', // 'no-cache' if you want it fresh each time
            })

            await onRefresh()
            setIsAction(true)
        } catch (e) {
            console.error("Status update failed", e)
        } finally {
            setIsAction(false)
        }
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent style={{ maxWidth: '40vw' }}>
            <SheetHeader>
            <SheetTitle>Order details (ID: {order ? order.id : ''})</SheetTitle>
            </SheetHeader>

            {order && (
                <CardContent className="space-y-4">
                    <Button onClick={handleSendOrder} disabled={isAction}>
                        {isAction && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isAction ? "Sending..." : "Send order (create order in DS provider)"}
                    </Button>
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
