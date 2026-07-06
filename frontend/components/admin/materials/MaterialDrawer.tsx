"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { CardContent } from "@/components/ui/card"
import { Material } from "@/types/material"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { getCookie } from "@/helpers/general"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"

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
    const [isAction, setIsAction] = useState(false)

    const handleUpdateStatus = async () => {
        if (!material) return

        try {
            setIsAction(true)

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

            // material status update
            await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/api/materials/${material.id}/update-status`, {
                method: 'POST',
                credentials: 'include',
                headers: headers,
                cache: 'no-cache', // 'no-cache' if you want it fresh each time
            })

            await onRefresh()
            setIsAction(true)
        } catch (e) {
            console.error("Status update failed", e)
        } finally {
            setIsAction(false)
        }
    }
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent style={{ maxWidth: '40vw' }}>
            <SheetHeader>
            <SheetTitle>Material details (ID: {material ? material.id : ''})</SheetTitle>
            </SheetHeader>

            {material && (
                <CardContent className="space-y-4">
                    <Button onClick={handleUpdateStatus} disabled={isAction}>
                        {isAction && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isAction ? "Updating..." : "Update Status"}
                    </Button>
                    <FieldGroup className="grid grid-cols-2">
                        <Field>
                            <FieldLabel>Name</FieldLabel>
                            <div className="text-md text-muted-foreground">
                                {material.name}
                            </div>
                        </Field>
                    </FieldGroup>
                </CardContent>
            )}
        </SheetContent>
        </Sheet>
    )
}
