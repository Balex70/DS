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
import { Product } from "@/types/product"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export function EditProductDrawer({
  open,
  onOpenChange,
  product,
  onSuccess
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  product: Product | null
  onSuccess: () => void
}) {
    const [nameRaw, setNameRaw] = useState("")
    const [price, setPrice] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedLocale, setSelectedLocale] = useState("en")
    const locales = ["en", "uk"]

    const [translations, setTranslations] = useState<
        Record<
            string,
            {
                name: string
                description: string
            }
        >
    >({})

    const updateTranslation = (
        locale: string,
        field: "name" | "description",
        value: string,
    ) => {
        setTranslations((prev) => ({
            ...prev,
            [locale]: {
                ...(prev[locale] ?? {
                    name: "",
                    description: "",
                }),
                [field]: value,
            },
        }))
    }
    
    useEffect(() => {
        if (!product) {
            return
        }
        setNameRaw(product.name_raw)

        locales.forEach(locale => {
            updateTranslation(
                locale,
                "name",
                locale === "en" ? product.name_processed : product.translations.find(t => t.locale === locale)?.name ?? "",
            )

            updateTranslation(
                locale,
                "description",
                locale === "en" ? product.description_processed : product.translations.find(t => t.locale === locale)?.description ?? "",
            )
        });
        setPrice(product.price)
    }, [product])
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
            // Update the product
            const res = await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/api/products/${product?.id}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: headers,
                body: JSON.stringify({
                    name_raw: nameRaw,
                    translations: translations,
                    price: price,
                }),
                cache: 'no-cache', // 'no-cache' if you want it fresh each time
            })
            
            if (!res.ok) {
                const data = await res.json()

                setError(data.message || 'Failed to save product')
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

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" style={{ maxWidth: '40vw' }}>
            <SheetHeader>
            <SheetTitle>Edit product</SheetTitle>
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

            {product && (
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
                        <Input disabled id="name_raw" value={nameRaw} onChange={(e) => setNameRaw(e.target.value)}/>
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
                        <FieldLabel>Description (description processed)</FieldLabel>

                        <Textarea
                            value={translations[selectedLocale]?.description ?? ""}
                            onChange={(e) =>
                                updateTranslation(
                                    selectedLocale,
                                    "description",
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
