"use client"

import { PriceRenderer } from "@/components/custom/PriceRenderer"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Product } from "@/types/product"

export function ProductDrawerMainFields({product}: {product: Product}) {
  return (
    <FieldGroup className="grid grid-cols-2">
        <Field>
            <FieldLabel>Description Raw</FieldLabel>
            <div className="h-[15vh] resize-y overflow-auto overflow-auto rounded-lg border bg-muted/30 p-4">
                <pre className="text-xs font-mono whitespace-pre-wrap break-all">
                    {JSON.stringify(product.description_raw, null, 2)}
                </pre>
            </div>
        </Field>
        <Field>
            <FieldLabel>Description Processed</FieldLabel>
            <span className="text-md text-muted-foreground">
                {product.description_processed}
            </span>
        </Field>
        <Field>
            <FieldLabel>Cost Price</FieldLabel>
            <div className="text-md text-muted-foreground">
                <PriceRenderer value={product.cost_price} />
            </div>
        </Field>
        <Field>
            <FieldLabel>Price</FieldLabel>
            <div className="text-md text-muted-foreground">
                <PriceRenderer value={product.price} />
            </div>
        </Field>
        <Field>
            <FieldLabel>Now Price</FieldLabel>
            <div className="text-md text-muted-foreground">
                <PriceRenderer value={product.now_price} />
            </div>
        </Field>
        <Field>
            <FieldLabel>Suggested Price</FieldLabel>
            <div className="text-md text-muted-foreground">
                <PriceRenderer value={product.suggested_price} />
            </div>
        </Field>
        <Field>
            <FieldLabel>Inventory (warehouse_inventory_num)</FieldLabel>
            <div className="text-md text-muted-foreground">
                {product.warehouse_inventory_num}
            </div>
        </Field>
        <Field>
            <FieldLabel>AI Status</FieldLabel>
            <div className="text-md text-muted-foreground">
                {product.ai_status}
            </div>
        </Field>
    </FieldGroup>
  )
}
