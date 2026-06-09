"use client"

import { User } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { getCookie, getErrorStringFromCatch } from "@/helpers/general"
import { useState } from "react"
import { toast } from "sonner"

export function AdminUserDropdown() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const logout = async () => {
    try {
      const csrfToken = getCookie('XSRF-TOKEN');
      const headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-XSRF-TOKEN': csrfToken!, // get the csrf token
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/users/logout`, {
          method: 'POST',
          credentials: 'include',
          headers: headers,
          cache: 'no-cache', // 'no-cache' if you want it fresh each time
      })

      if (res.ok) {
        router.push('/admin/login')
        return
      }
    } catch (err: unknown) {
      setError(getErrorStringFromCatch(err))
    } finally {
      // setLoading(false)
    }
  }

  if (error) {
    toast.error(error)
    setError(null)
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <User className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all " />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* Something to render about admin user */}
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout()}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
