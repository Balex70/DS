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
            <FieldLabel>Shipping Method</FieldLabel>
            <span className="text-md text-muted-foreground">
                {order.shipping_method ?? "no shipping method"}
            </span>
        </Field>
        <Field>
            <FieldLabel>Shipping Full Name</FieldLabel>
            <div className="flex flex-col">
                <span className="text-md text-muted-foreground">
                    Latin: {order.shipping_full_name_latin}
                </span>
                <span className="text-md text-muted-foreground">
                    Origin: {order.shipping_full_name}
                </span>
            </div>
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
            <div className="flex flex-col">
                <span className="text-md text-muted-foreground">
                    Latin: {order.shipping_address_line1_latin}
                </span>
                <span className="text-md text-muted-foreground">
                    Origin: {order.shipping_address_line1}
                </span>
            </div>
        </Field>
        <Field>
            <FieldLabel>Shipping Address Line 2</FieldLabel>
            <div className="flex flex-col">
                <span className="text-md text-muted-foreground">
                    Latin: {order.shipping_address_line2_latin ?? "<NOT PROVIDED>"}
                </span>
                <span className="text-md text-muted-foreground">
                    Origin: {order.shipping_address_line2 ?? "<NOT PROVIDED>"}
                </span>
            </div>
        </Field>
        <Field>
            <FieldLabel>Shipping City</FieldLabel>
            <div className="flex flex-col">
                <span className="text-md text-muted-foreground">
                    Latin: {order.shipping_city_latin}
                </span>
                <span className="text-md text-muted-foreground">
                    Origin: {order.shipping_city}
                </span>
            </div>
        </Field>
        <Field>
            <FieldLabel>Shipping State</FieldLabel>
            <div className="flex flex-col">
                <span className="text-md text-muted-foreground">
                    Latin: {order.shipping_state_latin ?? "<NOT PROVIDED>"}
                </span>
                <span className="text-md text-muted-foreground">
                    Origin: {order.shipping_state ?? "<NOT PROVIDED>"}
                </span>
            </div>
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
