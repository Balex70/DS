"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Product } from "@/types/product"

export function ProductDrawer({
  open,
  onOpenChange,
  product,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  product: Product | null
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Product details</SheetTitle>
        </SheetHeader>

        {product && (
            <CardContent className="space-y-4">
                <div>
                    <Label>Name Raw</Label>
                    <div className="text-md text-muted-foreground">
                        {product.name_raw}
                    </div>
                </div>

                <div>
                    <Label>Name Processed</Label>
                    <div className="text-md text-muted-foreground">
                        {product.name_processed}
                    </div>
                </div>

                <div>
                    <Label>Price</Label>
                    <div className="text-md text-muted-foreground">
                        {product.price}
                    </div>
                </div>

                <div>
                    <Label>Now Price</Label>
                    <div className="text-md text-muted-foreground">
                        {product.now_price}
                    </div>
                </div>

                <div>
                    <Label>Is collect</Label>
                    <div className="text-md text-muted-foreground">
                        {product.is_collect}
                    </div>
                </div>

                <div>
                    <Label>Shipping included (add_mark_status)</Label>
                    <div className="text-md text-muted-foreground">
                        {product.add_mark_status}
                    </div>
                </div>
            </CardContent>
        )}
      </SheetContent>
    </Sheet>
  )
}
