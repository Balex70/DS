"use client"

import { PriceRenderer } from "@/components/custom/PriceRenderer"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Payment } from "@/types/payment"

export function PaymentDrawerOrderFields({payment}: {payment: Payment}) {
  return (
    <FieldGroup className="grid grid-cols-2">
        <Field>
            <FieldLabel>Status</FieldLabel>
            <span className="text-md text-muted-foreground">
                {payment.order.status}
            </span>
        </Field>
        <Field>
            <FieldLabel>Shipping Method</FieldLabel>
            <span className="text-md text-muted-foreground">
                {payment.order.shipping_method ?? "no shipping method"}
            </span>
        </Field>
        <Field>
            <FieldLabel>Subtotal</FieldLabel>
            <span className="text-md text-muted-foreground">
                <PriceRenderer value={payment.order.subtotal} />
            </span>
        </Field>
        <Field>
            <FieldLabel>Total</FieldLabel>
            <span className="text-md text-muted-foreground">
                <PriceRenderer value={payment.order.total} />
            </span>
        </Field>
        <Field>
            <FieldLabel>DS Provider</FieldLabel>
            <span className="text-md text-muted-foreground">
                {payment.order.ds_provider}
            </span>
        </Field>
        <Field>
            <FieldLabel>DS Order ID</FieldLabel>
            <span className="text-md text-muted-foreground">
                {payment.order.ds_order_id ?? "no order id"}
            </span>
        </Field>
        <Field>
            <FieldLabel>DS Tracking Number</FieldLabel>
            <span className="text-md text-muted-foreground">
                {payment.order.ds_tracking_number ?? "no tracking number"}
            </span>
        </Field>
        <Field>
            <FieldLabel>DS Status</FieldLabel>
            <span className="text-md text-muted-foreground">
                {payment.order.ds_status ?? "no status"}
            </span>
        </Field>
        <Field>
            <FieldLabel>Notes</FieldLabel>
            <div className="h-[15vh] resize-y overflow-auto overflow-auto rounded-lg border bg-muted/30 p-4">
                <pre className="text-xs font-mono whitespace-pre-wrap break-all">
                    {payment.order.notes ? JSON.stringify(payment.order.notes, null, 2) : "no notes"}
                </pre>
            </div>
        </Field>
    </FieldGroup>
)}
