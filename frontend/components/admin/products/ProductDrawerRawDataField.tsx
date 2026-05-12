"use client"

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Product } from "@/types/product"

export function ProductDrawerRawDataField({product}: {product: Product}) {
  return (
    <FieldGroup className="min-w-0">
        <Field>
            <FieldLabel>Raw data</FieldLabel>
            <div className="max-h-[50vh] overflow-auto rounded-lg border bg-muted/30 p-4">
                <pre className="text-xs font-mono whitespace-pre-wrap break-all">
                    {JSON.stringify(product.raw_data, null, 2)}
                </pre>
            </div>
        </Field>
    </FieldGroup>
    
  )
}
