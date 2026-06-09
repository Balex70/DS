"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useState } from "react"
import { availableRoles } from "@/enums/roles"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getCookie, getErrorStringFromCatch } from "@/helpers/general"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function CreateUserDrawer({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onSuccess: () => void
}) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [role, setRole] = useState<string>("user")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreateUser = async () => {
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
            `${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/api/users`,
            {
            method: "POST",
            credentials: "include",
            headers: headers,
            body: JSON.stringify({
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
                role,
            }),
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
              setError('Something went wrong on server, maybe you don\'t have permissions?');
            }
            return
        }

        // ✅ success
        onOpenChange(false)
        onSuccess()

        // reset form
        setName("")
        setEmail("")
        setPassword("")
        setPasswordConfirmation("")
        setRole("user")

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
          <SheetTitle>Add User</SheetTitle>
        </SheetHeader>

        <form
          className="space-y-4 mt-4 mx-4"
          onSubmit={(e) => {
            e.preventDefault()
            handleCreateUser()
          }}
        >
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="form-rhf-demo-title">
                        Name
                    </FieldLabel>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)}/>
                </Field>
                <Field>
                    <FieldLabel htmlFor="form-rhf-demo-title">
                        Email
                    </FieldLabel>
                    <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </Field>
                <Field>
                    <FieldLabel htmlFor="form-rhf-demo-title">
                        Password
                    </FieldLabel>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </Field>
                <Field>
                    <FieldLabel htmlFor="form-rhf-demo-title">
                        Confirm Password
                    </FieldLabel>
                    <Input id="passwordConfirmation" type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)}/>
                </Field>
                <Field>
                    <FieldLabel htmlFor="form-rhf-demo-title">
                        Role
                    </FieldLabel>
                    <Select value={role} onValueChange={setRole}>
                        <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select role" />
                        </SelectTrigger>

                        <SelectContent>
                        <SelectGroup>
                            {availableRoles.map((r) => (
                            <SelectItem key={r} value={r}>
                                {r}
                            </SelectItem>
                            ))}
                        </SelectGroup>
                        </SelectContent>
                    </Select>
                </Field>
                
            </FieldGroup>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <button className="bg-black text-white px-4 py-2 rounded w-full">
            {loading ? "Creating..." : "Create User"}
          </button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
