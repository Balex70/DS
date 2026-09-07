"use client"

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Order } from "@/types/order"

export function OrderDrawerCustomerFields({order}: {order: Order}) {
  return (
    <FieldGroup className="grid grid-cols-2">
        <Field>
            <FieldLabel>Customer ID</FieldLabel>
            <div className="text-md text-muted-foreground">
                {order.customer_id ?? "Guest"}
            </div>
        </Field>
        <Field>
            <FieldLabel>Locale</FieldLabel>
            <span className="text-md text-muted-foreground">
                {order.locale}
            </span>
        </Field>
    </FieldGroup>
  )
}
