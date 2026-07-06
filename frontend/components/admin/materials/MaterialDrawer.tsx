"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Material } from "@/types/material"
import { useEffect, useState } from "react"
import { getCookie, getErrorStringFromCatch } from "@/helpers/general"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner";

export function MaterialDrawer({
  open,
  onOpenChange,
  material,
  onRefresh
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  material: Material | null
  onRefresh: () => void
}) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
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
            if (!material) {
                return
            }
            locales.forEach(locale => {
                updateTranslation(
                    locale,
                    "name",
                    locale === "en" ? material.name : material.translations.find(t => t.locale === locale)?.name ?? "",
                )
            });
        }, [material])

    const handleUpdateMaterial = async () => {
        if (!material) return

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
                'X-XSRF-TOKEN': csrfToken!
            };

            // material update
            const res = await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/api/materials/${material.id}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: headers,
                body: JSON.stringify({
                    name: material.name,
                    translations: translations,
                }),
                cache: 'no-cache', // 'no-cache' if you want it fresh each time
            })

            if (!res.ok) {
                const data = await res.json()

                setError(data.message || 'Failed to save material')
                return
            }

            toast.success("Material Updated");
            await onRefresh()
        } catch (e) {
            setError(getErrorStringFromCatch(e))
        } finally {
            setLoading(false)
        }
    }

    if (error) {
        toast.error(error)
        setError(null)
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent style={{ maxWidth: '40vw' }}>
            <SheetHeader>
            <SheetTitle>Material (ID: {material ? material.id : ''})</SheetTitle>
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
            {material && (
            <form
                className="space-y-4 mt-4 mx-4"
                onSubmit={(e) => {
                    e.preventDefault()
                    handleUpdateMaterial()
                }}
                >
                <FieldGroup>
                    <Field>
                        <FieldLabel>Name</FieldLabel>

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
