"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useState } from "react"
import { OrderItem } from "@/types/order"
import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"

function CopyButton({
    value,
    type,
    copied,
    onCopy,
}: {
    value: string
    type: "vid" | "sku" | "title"
    copied: "vid" | "sku" | "title" | null
    onCopy: (value: string, type: "vid" | "sku" | "title") => void
}) {
    const isCopied = copied === type

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
            onClick={() => onCopy(value, type)}
            title={isCopied ? "Copied!" : `Copy ${type.toUpperCase()}`}
            aria-label={`Copy ${type}`}
        >
            {isCopied ? (
                <Check className="h-4 w-4 text-green-600" />
            ) : (
                <Copy className="h-4 w-4" />
            )}
        </Button>
    )
}
    
export function OrderItemsDrawer({
  open,
  onOpenChange,
  productItem
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  productItem: OrderItem | null
}) {
    const [copied, setCopied] = useState<"vid" | "sku" | "title" | null>(null)

    const copyToClipboard = async (
        value: string,
        type: "vid" | "sku" | "title"
    ) => {
        await navigator.clipboard.writeText(value)

        setCopied(type)

        setTimeout(() => {
            setCopied(null)
        }, 1500)
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" style={{ maxWidth: '40vw' }}>
            <SheetHeader>
            <SheetTitle>Variant ID: {productItem?.product_variant_id}</SheetTitle>
            <div className="flex items-center gap-2">
                <span className="min-w-0 break-words">
                    Title: {productItem?.title}
                </span>

                {productItem?.title && (
                    <CopyButton
                        value={productItem.title}
                        type="title"
                        copied={copied}
                        onCopy={copyToClipboard}
                    />
                )}
            </div>
            <div className="flex items-center gap-2">
                <span>VID: {productItem?.vid}</span>

                {productItem?.vid && (
                    <CopyButton
                        value={productItem.vid}
                        type="vid"
                        copied={copied}
                        onCopy={copyToClipboard}
                    />
                )}
            </div>
            <div className="flex items-center gap-2">
                <span>SKU: {productItem?.sku}</span>

                {productItem?.sku && (
                    <CopyButton
                        value={productItem.sku}
                        type="sku"
                        copied={copied}
                        onCopy={copyToClipboard}
                    />
                )}
            </div>
            </SheetHeader>
        </SheetContent>
        </Sheet>
    )
}
