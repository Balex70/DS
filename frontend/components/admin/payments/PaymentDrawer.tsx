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

export function PaymentDrawer({
  open,
  onOpenChange,
  payment
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  payment: Payment | null
}) {
    
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent style={{ maxWidth: '40vw' }}>
            <SheetHeader>
            <SheetTitle>Payment details (ID: {payment ? payment.id : ''})</SheetTitle>
            </SheetHeader>

            {payment && (
                <CardContent className="space-y-4">
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
