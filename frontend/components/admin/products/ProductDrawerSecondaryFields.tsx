"use client"

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Product } from "@/types/product"
import { format } from "date-fns"

export function ProductDrawerSecondaryFields({product}: {product: Product}) {
  return (
    <FieldGroup className="grid grid-cols-2">
        <Field>
            <FieldLabel>External ID</FieldLabel>
            <div className="text-md text-muted-foreground">
                {product.external_id}
            </div>
        </Field>
        <Field>
            <FieldLabel>Slug</FieldLabel>
            <div className="text-md text-muted-foreground">
                {product.slug}
            </div>
        </Field>
        <Field>
            <FieldLabel>Is collect (added product to Wishlist or Collection)</FieldLabel>
            <div className="text-md text-muted-foreground">
                {product.is_collect ? "Yes" : "No"}
            </div>
        </Field>
        <Field>
            <FieldLabel>Shipping included (add_mark_status)</FieldLabel>
            <div className="text-md text-muted-foreground">
                {product.add_mark_status ? "Yes" : "No"}
            </div>
        </Field>
        <Field>
            <FieldLabel>Enrichment</FieldLabel>
            <div className="text-md text-muted-foreground">
                {product.last_enrichment_at ? format(new Date(product.last_enrichment_at), "PPpp") : "No"}
            </div>
        </Field>
    </FieldGroup>
  )
}
