"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useCallback, useEffect, useState } from "react"
import { getErrorStringFromCatch } from "@/helpers/general"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Category, CategorySyncState } from "@/types/category"
import { toast } from "sonner";
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { CardContent } from "@/components/ui/card"
import NextImageWithReplace from "@/components/custom/NextImageWithReplace"

export function ViewCategoryDrawer({
  open,
  onOpenChange,
  category
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  category: Category | null
}) {
    const [syncState, setSyncState] = useState<CategorySyncState | null>(null)
    const [isSynStateLoading, setIsSyncStateLoading] = useState(false)
    const [syncStateError, setSyncStateError] = useState<string | null>(null)
    const [isSyncing, setIsSyncing] = useState(false)
    const [syncError, setSyncError] = useState<string | null>(null)

    const fetchCategorySyncState = useCallback(async () => {
        if (!category) return
        try {
            setIsSyncStateLoading(true)

            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            };

            // fetch category sync state
            const res = await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/api/categories/get-sync-state/${category.id}`, {
                method: 'GET',
                credentials: 'include',
                headers: headers,
                cache: 'no-cache', // 'no-cache' if you want it fresh each time
            })

            if (!res.ok) {
                const data = await res.json()

                setSyncStateError(data.message || 'Failed to get sync category state')
                return
            }
            const stateRes = await res.json()
            setSyncState(stateRes.data ?? [])
        } catch (err: unknown) {
            setSyncStateError(getErrorStringFromCatch(err))
        } finally {
            setIsSyncStateLoading(false)
        }
    }, [category]);

    useEffect(() => {
        fetchCategorySyncState()
    }, [category?.id, fetchCategorySyncState])

    const handleSyncCategoryProducts = async () => {
        if (!category) return

        try {
            setIsSyncing(true)

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
            const res = await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/api/categories/sync-category-products/${category.id}`, {
                method: "POST",
                credentials: 'include',
                headers: headers,
                cache: 'no-cache', // 'no-cache' if you want it fresh each time
            })

            if (!res.ok) {
                const data = await res.json()

                setSyncError(data.message || 'Failed to dispatch sync category products')
                return
            }

            toast.success("Sync category products job dispatched");
        } catch (err) {
            console.error("Dispatch sync for category failed", err)
            setSyncError(getErrorStringFromCatch(err))
        } finally {
            setIsSyncing(false)
        }
    }

    if (syncStateError) {
        toast.error(syncStateError)
        setSyncStateError(null)
    }

    if (syncError) {
        toast.error(syncError)
        setSyncError(null)
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
            <div className="flex items-center gap-2">
                    <Button onClick={handleSyncCategoryProducts} disabled={isSyncing}>
                        {isSyncing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSyncing ? "Sending..." : "Sync products for category"}
                    </Button>
                </div>
            </SheetHeader>
            
            {category && (
                <CardContent className="space-y-4">
                    {category.image &&
                        <NextImageWithReplace
                            src={category.image}
                            alt={'name'}
                            width={200}
                            height={200}
                            imageClassName="object-cover rounded-md border"
                        />
                    }

                    <FieldGroup className="grid grid-cols-2 gap-4 space-x-4">
                        <Field>
                            <FieldLabel>Sync finished</FieldLabel>
                            <div className="flex flex-wrap gap-2">
                                {syncState?.finished
                                    ?
                                    <Badge className="bg-teal-300 text-white hover:bg-teal-300">
                                        YES
                                    </Badge>
                                    :
                                    <Badge className="bg-amber-300 text-white hover:bg-amber-300">
                                        NO
                                    </Badge>
                                }
                            </div>
                        </Field>
                        <Field>
                            <FieldLabel>Sync last run</FieldLabel>
                            <div className="text-md text-muted-foreground">
                                {syncState?.last_run_at ? format(new Date(syncState.last_run_at), "PPpp") : "No"}
                            </div>
                        </Field>
                        <Field>
                            <FieldLabel>Name</FieldLabel>
                            <span className="text-md text-muted-foreground">
                                {category.name}
                            </span>
                        </Field>
                        <Field>
                            <FieldLabel>Description</FieldLabel>
                            <span className="text-md text-muted-foreground">
                                {category.description}
                            </span>
                        </Field>
                        <Field>
                            <FieldLabel>Slug</FieldLabel>
                            <span className="text-md text-muted-foreground">
                                {category.slug}
                            </span>
                        </Field>
                        <Field>
                            <FieldLabel>Full path</FieldLabel>
                            <span className="text-md text-muted-foreground">
                                {category.full_path}
                            </span>
                        </Field>
                        <Field>
                            <FieldLabel>Active</FieldLabel>

                            <div className="flex flex-wrap gap-2">
                                {category.active
                                    ?
                                    <Badge className="bg-green-500 text-white hover:bg-green-500">
                                        YES
                                    </Badge>
                                    :
                                    <Badge className="bg-red-400 text-white hover:bg-red-400">
                                        NO
                                    </Badge>
                                }
                            </div>
                        </Field>
                        <Field>
                            <FieldLabel>Visible</FieldLabel>

                            <div className="flex flex-wrap gap-2">
                                {category.is_visible
                                    ?
                                    <Badge className="bg-green-500 text-white hover:bg-green-500">
                                        YES
                                    </Badge>
                                    :
                                    <Badge className="bg-red-500 text-white hover:bg-red-500">
                                        NO
                                    </Badge>
                                }
                            </div>
                        </Field>
                        <Field>
                            <FieldLabel>Created at</FieldLabel>
                            <div className="text-md text-muted-foreground">
                                {category.created_at ? format(new Date(category.created_at), "PPpp") : "No"}
                            </div>
                        </Field>
                        <Field>
                            <FieldLabel>Updated at</FieldLabel>
                            <div className="text-md text-muted-foreground">
                                {category.updated_at ? format(new Date(category.updated_at), "PPpp") : "No"}
                            </div>
                        </Field>
                    </FieldGroup>
                </CardContent>
            )}
        </SheetContent>
        </Sheet>
    )
}
