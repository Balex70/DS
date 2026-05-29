"use client"

import { PriceRenderer } from "@/components/custom/PriceRenderer"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Order } from "@/types/order"


export function OrderDrawerShippingFields({order}: {order: Order}) {
  return (
    <FieldGroup className="grid grid-cols-2">
        <Field>
            <FieldLabel>Shipping Cost</FieldLabel>
            <span className="text-md text-muted-foreground">
                <PriceRenderer value={order.shipping_cost} />
            </span>
        </Field>
        <Field>
            <FieldLabel>Shipping Full Name</FieldLabel>
            <span className="text-md text-muted-foreground">
                {order.shipping_full_name}
            </span>
        </Field>
        <Field>
            <FieldLabel>Shipping Phone</FieldLabel>
            <span className="text-md text-muted-foreground">
                {order.shipping_phone ?? "no shipping phone"}
            </span>
        </Field>
        <Field>
            <FieldLabel>Shipping Email</FieldLabel>
            <span className="text-md text-muted-foreground">
                {order.shipping_email ?? "no shipping email"}
            </span>
        </Field>
        <Field>
            <FieldLabel>Shipping Address Line 1</FieldLabel>
            <span className="text-md text-muted-foreground">
                {order.shipping_address_line1}
            </span>
        </Field>
        <Field>
            <FieldLabel>Shipping Address Line 2</FieldLabel>
            <span className="text-md text-muted-foreground">
                {order.shipping_address_line2 ?? "no shipping address line 2"}
            </span>
        </Field>
        <Field>
            <FieldLabel>Shipping City</FieldLabel>
            <span className="text-md text-muted-foreground">
                {order.shipping_city}
            </span>
        </Field>
        <Field>
            <FieldLabel>Shipping State</FieldLabel>
            <span className="text-md text-muted-foreground">
                {order.shipping_state ?? "no shipping state"}
            </span>
        </Field>
        <Field>
            <FieldLabel>Shipping Postal Code</FieldLabel>
            <span className="text-md text-muted-foreground">
                {order.shipping_postal_code ?? "no shipping postal code"}
            </span>
        </Field>
        <Field>
            <FieldLabel>Shipping Country</FieldLabel>
            <span className="text-md text-muted-foreground">
                {order.shipping_country}
            </span>
        </Field>
    </FieldGroup>
    
  )
}
