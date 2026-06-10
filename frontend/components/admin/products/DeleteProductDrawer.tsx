"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useState } from "react"
import { getCookie, getErrorStringFromCatch } from "@/helpers/general"
import { Product } from "@/types/product"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2Icon } from "lucide-react"

export function DeleteProductDrawer({
  open,
  onOpenChange,
  onSuccess,
  product
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onSuccess: () => void
  product: Product | null
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDeleteProduct = async () => {
    setLoading(true)
    setError(null)

    try {
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
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/api/products/${product?.id}`,
            {
            method: "DELETE",
            credentials: "include",
            headers: headers,
            }
        )

        if (!res.ok) {
            const data = await res.json()
            setError(
            Object.values(data.errors ?? {})
                .flat()
                .join(", ")
            )

            const contentType = res.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
                setError('Something went wrong, maybe you don\'t have permissions!');
            }
            return
        }

        // Success
        onOpenChange(false)
        onSuccess()

    } catch (err: unknown) {
      setError(getErrorStringFromCatch(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!w-full sm:!max-w-[500px]">
        <SheetHeader>
          <SheetTitle>Delete Product</SheetTitle>
        </SheetHeader>

        <form
          className="space-y-4 mt-4 mx-4"
          onSubmit={(e) => {
            e.preventDefault()
            handleDeleteProduct()
          }}
        >
          <Alert className="max-w-md border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
            <CheckCircle2Icon />
            <AlertTitle>Product will deleted</AlertTitle>
            <AlertDescription>
              Are you sure you want to delete product <b className="text-red-500">{product?.name_raw}</b> (ID: <b className="text-red-500">{product?.id}</b>)?
            </AlertDescription>
          </Alert>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <button className="bg-black text-white px-4 py-2 rounded w-full">
            {loading ? "Deleting..." : "Delete Product"}
          </button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
