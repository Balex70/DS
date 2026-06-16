"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { CardContent } from "@/components/ui/card"
import { Payment } from "@/types/payment"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PaymentDrawerMainFields } from "./PaymentDrawerMainFields"
import { PaymentDrawerOrderFields } from "./PaymentDrawerOrderFields"
import { OrderDrawerItemsFields } from "../orders/OrderDrawerItemsFields"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { getCookie } from "@/helpers/general"

export function PaymentDrawer({
  open,
  onOpenChange,
  payment,
  onRefresh
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  payment: Payment | null
  onRefresh: () => void
}) {
    const [isAction, setIsAction] = useState(false)

    const handleUpdateStatus = async () => {
        if (!payment) return

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
            await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/api/payments/${payment.id}/update-status`, {
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
            <SheetTitle>Payment details (ID: {payment ? payment.id : ''})</SheetTitle>
            </SheetHeader>

            {payment && (
                <CardContent className="space-y-4">
                    <Button onClick={handleUpdateStatus} disabled={isAction}>
                        {isAction && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isAction ? "Updating..." : "Update Status"}
                    </Button>
                    <Tabs defaultValue="main">
                        <TabsList variant="line" className="mb-5">
                            <TabsTrigger value="main">Main</TabsTrigger>
                            <TabsTrigger value="order">Order</TabsTrigger>
                            <TabsTrigger value="orderitems">Order Items</TabsTrigger>
                        </TabsList>
                        <TabsContent value="main">
                            <PaymentDrawerMainFields payment={payment} />
                        </TabsContent>
                        <TabsContent value="order">
                            <PaymentDrawerOrderFields payment={payment} />
                        </TabsContent>
                        <TabsContent value="orderitems">
                            <OrderDrawerItemsFields order={payment.order} />
                        </TabsContent>
                        </Tabs>
                </CardContent>
            )}
        </SheetContent>
        </Sheet>
    )
}
