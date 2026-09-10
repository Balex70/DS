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
import { Category, CategoryEditableFields } from "@/types/category"
import NextImageWithReplace from "@/components/custom/NextImageWithReplace"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner";

export function EditCategoryDrawer({
  open,
  onOpenChange,
  category,
  onSuccess
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  category: Category | null
  onSuccess: () => void
}) {
    const [image, setImage] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [previewType, setPreviewType] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedLocale, setSelectedLocale] = useState("en")
    const locales = ["en", "uk"]
    const [translations, setTranslations] = useState<
        Record<
            string,
            {
                name: string,
                description: string,
                meta_title: string,
                meta_description: string
            }
        >
    >({})
    
    const updateTranslation = (
        locale: string,
        field: CategoryEditableFields,
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
        if (category) {
            locales.forEach(locale => {
                updateTranslation(
                    locale,
                    "name",
                    locale === "en" ? category.name : category.translations.find(t => t.locale === locale)?.name ?? "",
                )
            });
            locales.forEach(locale => {
                updateTranslation(
                    locale,
                    "meta_title",
                    locale === "en" ? category.meta_title : category.translations.find(t => t.locale === locale)?.meta_title ?? "",
                )
            });
            locales.forEach(locale => {
                updateTranslation(
                    locale,
                    "description",
                    locale === "en" ? category.description : category.translations.find(t => t.locale === locale)?.description ?? "",
                )
            });
            locales.forEach(locale => {
                updateTranslation(
                    locale,
                    "meta_description",
                    locale === "en" ? category.meta_description : category.translations.find(t => t.locale === locale)?.meta_description ?? "",
                )
            });

            if (category.image) {
                setPreview(`${category.image}`)
                setPreviewType('origin')
            } else {
                setPreview(null)
            }

            setImage(null)
        }
    }, [category])

    const handleSaveCategory = async () => {
        setLoading(true)
        setError(null)
        try {
            setLoading(true)
    
            // get the csrf token
            await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/sanctum/csrf-cookie`, {
                credentials: 'include',
            });
            
            const formData = new FormData()
            formData.append("translations", JSON.stringify(translations));

            if (image) {
                formData.append("image", image)
            }
            
            const csrfToken = getCookie('XSRF-TOKEN');
            const headers = {
                // 'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-XSRF-TOKEN': csrfToken!, // get the csrf token
            };
            // Update the category
            const res = await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/api/categories/${category?.id}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: headers,
                body: formData,
                cache: 'no-cache', // 'no-cache' if you want it fresh each time
            })
            
            if (!res.ok) {
                const data = await res.json()

                setError(data.message || 'Failed to update category')
                return
            }

            toast.success("Category Updated");
            onSuccess();
            onOpenChange(false);

          } catch (err: unknown) {
            setError(getErrorStringFromCatch(err))
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
        <SheetContent
            side="right"
            className="flex flex-col"
            style={{ maxWidth: '40vw' }}
            >
            <SheetHeader>
            <SheetTitle>Edit category (ID: {category?.id})</SheetTitle>
            <SheetTitle>External ID: {category?.external_id}</SheetTitle>
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
            {category && (
            <form
                className="flex-1 overflow-y-auto space-y-4 mt-4 mx-4 pr-2"
                onSubmit={(e) => {
                    e.preventDefault()
                    handleSaveCategory()
                }}
                >
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="form-rhf-demo-title">
                            Name
                        </FieldLabel>
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
                            Meta title
                        </FieldLabel>
                        <Input
                            value={translations[selectedLocale]?.meta_title ?? ""}
                            onChange={(e) =>
                                updateTranslation(
                                    selectedLocale,
                                    "meta_title",
                                    e.target.value,
                                )
                            }
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="form-rhf-demo-title">
                            Description
                        </FieldLabel>
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
                            Meta Description
                        </FieldLabel>
                        <Textarea
                            value={translations[selectedLocale]?.meta_description ?? ""}
                            onChange={(e) =>
                                updateTranslation(
                                    selectedLocale,
                                    "meta_description",
                                    e.target.value,
                                )
                            }
                        />
                    </Field>

                    <Field>
                        <FieldLabel>
                            Category Image
                        </FieldLabel>

                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0] ?? null
                                setImage(file)

                                if (file) {
                                    setPreview(URL.createObjectURL(file))
                                    setPreviewType('updated')
                                }
                            }}
                        />
                    </Field>
                    
                    {preview && (
                        (previewType === 'origin' ? (
                            <NextImageWithReplace
                                src={preview}
                                alt={'name'}
                                width={200}
                                height={200}
                                imageClassName="object-cover rounded-md border"
                            />
                            ) : (
                                <img
                                    src={preview}
                                    alt={'name'}
                                    width={200}
                                    height={200}
                                    className="object-cover rounded-md border"
                                />
                            )    
                        )
                    )}
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
