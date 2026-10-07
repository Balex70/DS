"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useEffect, useState } from "react"
import { getCookie, getErrorStringFromCatch } from "@/helpers/general"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ProductVariant } from "@/types/product"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function EditProductVariantDrawer({
  open,
  onOpenChange,
  productVariant,
  onSuccess
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  productVariant: ProductVariant | null
  onSuccess: () => void
}) {
    const [name, setName] = useState("")
    const [price, setPrice] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isStockUpdating, setIsStockUpdating] = useState(false)
    const [selectedLocale, setSelectedLocale] = useState("en")
    const locales = ["en", "uk"]

    const [translations, setTranslations] = useState<
        Record<
            string,
            {
                name: string
            }
        >
    >({})

    const [copied, setCopied] = useState<"vid" | "sku" | null>(null)

    const copyToClipboard = async (
        value: string,
        type: "vid" | "sku"
    ) => {
        await navigator.clipboard.writeText(value)

        setCopied(type)

        setTimeout(() => {
            setCopied(null)
        }, 1500)
    }

    const getAiStatusBadge = (status: string) => {
        switch (status) {
            case "queued":
                return (
                    <Badge className="bg-yellow-200 text-yellow-800 hover:bg-yellow-100">
                        {status}
                    </Badge>
                )

            case "processing":
                return (
                    <Badge className="bg-blue-200 text-blue-800 hover:bg-blue-100">
                        {status}
                    </Badge>
                )

            case "failed":
                return (
                    <Badge className="bg-red-200 text-red-800 hover:bg-red-100">
                        {status}
                    </Badge>
                )

            case "done":
                return (
                    <Badge className="bg-green-200 text-green-800 hover:bg-green-100">
                        {status}
                    </Badge>
                )

            default:
                return (
                    <Badge className="bg-gray-200 text-gray-800 hover:bg-gray-100">
                        Null
                    </Badge>
                )
        }
    }

    const updateTranslation = (
        locale: string,
        field: "name",
        value: string,
    ) => {
        setTranslations((prev) => ({
            ...prev,
            [locale]: {
                ...(prev[locale] ?? {
                    name: "",
                }),
                [field]: value,
            },
        }))
    }
    
    useEffect(() => {
        if (!productVariant) {
            return
        }
        setName(productVariant.name)

        locales.forEach(locale => {
            updateTranslation(
                locale,
                "name",
                locale === "en" ? productVariant.name_processed : productVariant.translations.find(t => t.locale === locale)?.name ?? "",
            )
        });
        setPrice(productVariant.price)
    }, [productVariant])
    const handleSaveProduct = async () => {
        setLoading(true)
        setError(null)
        try {
            setLoading(true)
    
            // get the csrf token
            await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/sanctum/csrf-cookie`, {
                credentials: 'include',
            });
            
            const csrfToken = getCookie('XSRF-TOKEN');
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-XSRF-TOKEN': csrfToken!, // get the csrf token
            };
            // Update the product variant
            const res = await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/api/product-variants/${productVariant?.id}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: headers,
                body: JSON.stringify({
                    name: name,
                    translations: translations,
                    price: price,
                }),
                cache: 'no-cache', // 'no-cache' if you want it fresh each time
            })
            
            if (!res.ok) {
                const data = await res.json()

                setError(data.message || 'Failed to save product variant')
                return
            }

            onSuccess();
            onOpenChange(false);

        } catch (err: unknown) {
            setError(getErrorStringFromCatch(err))
        } finally {
            setLoading(false)
        }
    }

    const handleStockUpdate = async () => {
        if (!productVariant) return

        try {
            setIsStockUpdating(true)

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
            await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/api/product-variants/stock-update/${productVariant.id}`, {
                method: "PATCH",
                credentials: 'include',
                headers: headers,
                cache: 'no-cache', // 'no-cache' if you want it fresh each time
            })

            // await onRefresh()
        } catch (e) {
            console.error("Stock update failed", e)
        } finally {
            setIsStockUpdating(false)
        }
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" style={{ maxWidth: '40vw' }}>
            <SheetHeader>
            <SheetTitle>Edit product variant: {productVariant?.id}</SheetTitle>
            <div className="flex items-center">
                <span>VID: {productVariant?.external_id}</span>

                {productVariant?.external_id && (
                    <button
                        type="button"
                        onClick={() =>
                            copyToClipboard(productVariant.external_id, "vid")
                        }
                        className="ml-2"
                        title="Copy VID"
                    >
                        {copied === "vid" ? "✓" : "Copy"}
                    </button>
                )}
            </div>
            <div className="flex items-center">
                <span>SKU: {productVariant?.sku}</span>

                {productVariant?.sku && (
                    <button
                        type="button"
                        onClick={() =>
                            copyToClipboard(productVariant.sku, "sku")
                        }
                        className="ml-2"
                        title="Copy SKU"
                    >
                        {copied === "sku" ? "✓" : "Copy"}
                    </button>
                )}
            </div>
            {productVariant?.ai_status && (
                <div className="flex items-center gap-2">
                    <span>AI Status:</span>
                    {getAiStatusBadge(productVariant.ai_status)}
                </div>
            )}
            {productVariant?.stock && (
                <div className="flex items-center gap-2">
                    <span>Stock:</span>
                    {productVariant?.stock}
                </div>
            )}

            <Button onClick={handleStockUpdate} disabled={isStockUpdating}>
                {isStockUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isStockUpdating ? "Updating..." : "Stock update"}
            </Button>
            </SheetHeader>

            <Tabs
                className="mt-4 mx-4"
                value={selectedLocale}
                onValueChange={setSelectedLocale}
            >
                <TabsList>
                    {locales.map((locale) => (
                        <TabsTrigger
                            key={locale}
                            value={locale}
                        >
                            {locale.toUpperCase()}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            {productVariant && (
            <form
                className="space-y-4 mt-4 mx-4"
                onSubmit={(e) => {
                    e.preventDefault()
                    handleSaveProduct()
                }}
                >
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="form-rhf-demo-title">
                            Name Raw
                        </FieldLabel>
                        <Input disabled id="name_raw" value={name} onChange={(e) => setName(e.target.value)}/>
                    </Field>
                    
                    <Field>
                        <FieldLabel>Name (name processed)</FieldLabel>

                        <Input
                            value={translations[selectedLocale]?.name ?? ""}
                            onChange={(e) =>
                                updateTranslation(
                                    selectedLocale,
                                    "name",
                                    e.target.value,
                                )
                            }
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="form-rhf-demo-title">
                            Price
                        </FieldLabel>
                        <Input id="price" type="number" value={price} onChange={(e) => {
                            const val = e.target.value;
                            // If empty, set to 0 or null; otherwise convert to number
                            setPrice(val === "" ? 0 : Number(val));
                        }}/>
                    </Field>
                </FieldGroup>
                

                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}
                <button className="bg-black text-white px-4 py-2 rounded">
                    {loading ? 'Saving ...' : 'Save'}
                </button>
            </form>
            )}
        </SheetContent>
        </Sheet>
    )
}
