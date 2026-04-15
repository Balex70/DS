"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useState } from "react"
import { getCookie } from "@/helpers/general"
import { User } from "@/types/user"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2Icon } from "lucide-react"

export function DeleteUserDrawer({
  open,
  onOpenChange,
  onSuccess,
  user
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onSuccess: () => void
  user: User | null
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDeleteUser = async () => {
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
            `${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/api/users/${user?.id}`,
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
                setError('Something went wrong, maybe you don\'t have permissions or you are trying to delete yourself!');
            }
            return
        }

        // ✅ success
        onOpenChange(false)
        onSuccess()

    } catch (e) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!w-full sm:!max-w-[500px]">
        <SheetHeader>
          <SheetTitle>Add User</SheetTitle>
        </SheetHeader>

        <form
          className="space-y-4 mt-4 mx-4"
          onSubmit={(e) => {
            e.preventDefault()
            handleDeleteUser()
          }}
        >
          <Alert className="max-w-md border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
            <CheckCircle2Icon />
            <AlertTitle>User will deleted</AlertTitle>
            <AlertDescription>
              Are you sure you want to delete user <b className="text-red-500">{user?.name}</b> with email <b className="text-red-500">{user?.email}</b>?
            </AlertDescription>
          </Alert>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <button className="bg-black text-white px-4 py-2 rounded w-full">
            {loading ? "Deleting..." : "Delete User"}
          </button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
