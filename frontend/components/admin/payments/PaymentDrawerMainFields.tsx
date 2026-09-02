"use client"

import { PriceRenderer } from "@/components/custom/PriceRenderer"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Payment } from "@/types/payment"

export function PaymentDrawerMainFields({payment}: {payment: Payment}) {
  return (
    <FieldGroup className="grid grid-cols-2">
        <Field>
            <FieldLabel>Status</FieldLabel>
            <div className="text-md text-muted-foreground">
                {payment.status}
            </div>
        </Field>
        <Field>
            <FieldLabel>Amount</FieldLabel>
            <div className="text-md text-muted-foreground">
                <PriceRenderer value={payment.amount} />
            </div>
        </Field>
        <Field>
            <FieldLabel>Gateway</FieldLabel>
            <span className="text-md text-muted-foreground">
                {payment.gateway}
            </span>
        </Field>
        <Field>
            <FieldLabel>Transaction_id</FieldLabel>
            <span className="text-md text-muted-foreground">
                {payment.transaction_id}
            </span>
        </Field>
        
        <Field>
            <FieldLabel>Currency</FieldLabel>
            <div className="text-md text-muted-foreground">
                {payment.currency}
            </div>
        </Field>
    </FieldGroup>
  )
}
