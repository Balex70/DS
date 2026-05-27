"use client"

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Order } from "@/types/order"


export function OrderDrawerPaymentFields({order}: {order: Order}) {
  return (
    <FieldGroup className="grid grid-cols-2">
        <Field>
            <FieldLabel>Payment Method</FieldLabel>
            <span className="text-md text-muted-foreground">
                {order.payment_method}
            </span>
        </Field>
        <Field>
            <FieldLabel>Payment Status</FieldLabel>
            <span className="text-md text-muted-foreground">
                {order.payment_status}
            </span>
        </Field>
    </FieldGroup>
  )
}
