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
import { ProductImagesDrawer } from "./ProductImagesDrawer"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Loader2 } from "lucide-react"

export function ProductDrawer({
  open,
  onOpenChange,
  product,
  onRefresh
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  product: Product | null
  onRefresh: (params?: {
    page?: number,
    enriched: string|null,
    aiTextsProcessed: string|null,
    aiImagesProcessed: string|null,
  }) => void
}) {
    const [isEnriching, setIsEnriching] = useState(false)

    const handleEnrich = async () => {
        if (!product) return

        try {
            setIsEnriching(true)

            const getCookie = (name: string) => {
                const value = `; ${document.cookie}`
                const parts = value.split(`; ${name}=`)
                if (parts.length === 2) return parts.pop()?.split(";").shift()
            }

            const xsrfToken = decodeURIComponent(getCookie("XSRF-TOKEN") || "")

            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                 "X-XSRF-TOKEN": xsrfToken,
            };
            await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/api/enrich/${product.id}`, {
                method: "PATCH",
                credentials: 'include',
                headers: headers,
                cache: 'no-cache', // 'no-cache' if you want it fresh each time
            })

            await onRefresh()
        } catch (e) {
            console.error("Enrich failed", e)
        } finally {
            setIsEnriching(false)
        }
    }
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent style={{ maxWidth: '40vw' }}>
        <SheetHeader>
          <SheetTitle>Product details</SheetTitle>
        </SheetHeader>

        {product && (
            <CardContent className="space-y-4">
                <Button onClick={handleEnrich} disabled={isEnriching}>
                    {isEnriching && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEnriching ? "Enriching..." : "Enrich product"}
                </Button>
                <ProductImagesDrawer product={product}/>
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
