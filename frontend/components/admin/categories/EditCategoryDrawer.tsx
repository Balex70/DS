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
import { Category } from "@/types/category"
import NextImageWithReplace from "@/components/custom/NextImageWithReplace"

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
    const [name, setName] = useState("")
    const [image, setImage] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [previewType, setPreviewType] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    
    useEffect(() => {
        if (category) {
            setName(category.name)
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
            formData.append("name", name)

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
            <SheetTitle>Edit category (ID: {category?.id})</SheetTitle>
            <SheetTitle>External ID: {category?.external_id}</SheetTitle>
            </SheetHeader>

            {category && (
            <form
                className="space-y-4 mt-4 mx-4"
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
                        <Input id="name_raw" value={name} onChange={(e) => setName(e.target.value)}/>
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
                                alt={name}
                                width={200}
                                height={200}
                                imageClassName="object-cover rounded-md border"
                            />
                            ) : (
                                <img
                                    src={preview}
                                    alt={name}
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
