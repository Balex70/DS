"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { CardContent } from "@/components/ui/card"
import { ProductAiStatus, ProductWithCategories } from "@/types/product"
import { ProductImagesDrawer } from "./ProductImagesDrawer"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductDrawerMainFields } from "./ProductDrawerMainFields"
import { ProductDrawerSecondaryFields } from "./ProductDrawerSecondaryFields"
import NextImageWithReplace from "@/components/custom/NextImageWithReplace"
import { ProductDrawerRawDataField } from "./ProductDrawerRawDataField"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import ListProductVariants from "../productVariants/ListProductVariants"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export function ProductDrawer({
  open,
  onOpenChange,
  product,
  onRefresh
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  product: ProductWithCategories | null
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
                'X-XSRF-TOKEN': xsrfToken,
            };
            await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/api/products/enrich/${product.id}`, {
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

    const changeAiStatus = async (newAiStatus: ProductAiStatus) => {
        if (!product) return

        try {
            const getCookie = (name: string) => {
                const value = `; ${document.cookie}`
                const parts = value.split(`; ${name}=`)
                if (parts.length === 2) return parts.pop()?.split(";").shift()
            }

            const xsrfToken = decodeURIComponent(getCookie("XSRF-TOKEN") || "")

            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-XSRF-TOKEN': xsrfToken,
            };
            const response = await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/api/products/ai-status-change/${product.id}/${newAiStatus}`, {
                method: "PATCH",
                credentials: 'include',
                headers: headers,
                cache: 'no-cache', // 'no-cache' if you want it fresh each time
            })

            if (!response.ok) {
                throw new Error(`Failed to change AI status: ${response.status}`)
            }

            await onRefresh()
        } catch (e) {
            console.error("AI status change failed", e)
        } finally {
            //
        }
    }
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent style={{ maxWidth: '40vw' }}>
        <SheetHeader>
          <SheetTitle>Product details (ID: {product ? product.id : ''})</SheetTitle>
        </SheetHeader>

        {product && (
            <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                    <Button onClick={handleEnrich} disabled={isEnriching}>
                        {isEnriching && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEnriching ? "Enriching..." : "Enrich product"}
                    </Button>
                    <div className="flex items-center gap-2 ml-6">
                        <Label htmlFor="ai-status">AI status:</Label>
                        <Select
                            value={product.ai_status}
                            onValueChange={(value) => changeAiStatus(value as ProductAiStatus)}
                            >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="AI status" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="queued">Queued</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="done">Done</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex space-x-4">
                    {product.big_image && (
                        <div className="max-w-28 aspect-square overflow-hidden rounded-lg border bg-muted shrink-0">
                            <NextImageWithReplace
                                src={product.big_image.original_url}
                                alt={product.name_raw}
                                width={200}
                                height={200}
                                imageClassName="h-full w-full object-cover"
                            />
                        </div>
                    )}
                    <FieldGroup className="flex flex-col gap-4 min-w-0">
                        <Field className="gap-1">
                            <FieldLabel>Name Raw</FieldLabel>
                            <div className="text-md text-muted-foreground">
                                {product.name_raw}
                            </div>
                        </Field>
                        <Field className="gap-1">
                            <FieldLabel>Name Processed</FieldLabel>
                            <span className="text-md text-muted-foreground">
                                {product.name_processed}
                            </span>
                        </Field>
                    </FieldGroup>
                </div>
                <Tabs defaultValue="main">
                    <TabsList variant="line" className="mb-5">
                        <TabsTrigger value="main">Main</TabsTrigger>
                        <TabsTrigger value="secondary">Secondary</TabsTrigger>
                        <TabsTrigger value="images">Images</TabsTrigger>
                        <TabsTrigger value="variants">Variants</TabsTrigger>
                        <TabsTrigger value="raw">Raw Data</TabsTrigger>
                    </TabsList>
                    <TabsContent value="main">
                        <ProductDrawerMainFields product={product} />
                    </TabsContent>
                    <TabsContent value="secondary">
                        <ProductDrawerSecondaryFields product={product} />
                    </TabsContent>
                    <TabsContent value="images">
                        <ProductImagesDrawer product={product}/>
                    </TabsContent>
                    <TabsContent value="variants">
                        <ListProductVariants productId={product.id}/>
                    </TabsContent>
                    <TabsContent value="raw">
                        <ProductDrawerRawDataField product={product} />
                    </TabsContent>
                </Tabs>
            </CardContent>
        )}
      </SheetContent>
    </Sheet>
  )
}
