"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { User } from "./columns"
import { useEffect, useState } from "react"
import { getCookie } from "@/helpers/general"
import { availableRoles } from "@/enums/roles"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export function EditUserDrawer({
  open,
  onOpenChange,
  user,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  user: User | null
}) {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [role, setRole] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    
    useEffect(() => {
        if (user) {
            setName(user.name)
            setEmail(user.email)
            setRole(user.role)
        }
    }, [user])
    const handleSaveUser = async () => {
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
            // Update the user
            const res = await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/api/users/${user?.id}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: headers,
                body: JSON.stringify({
                    name: name,
                    email: email,
                    role: role
                }),
                cache: 'no-cache', // 'no-cache' if you want it fresh each time
            })
            
            if (!res.ok) {
                const data = await res.json()

                setError(data.message || 'Login failed')
                return
            }
            
          } catch (_err) {
            // do nothing
          } finally {
            setLoading(false)
          }
    }
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" style={{ maxWidth: '40vw' }}>
            <SheetHeader>
            <SheetTitle>Edit user</SheetTitle>
            </SheetHeader>

            {user && (
            <form
                className="space-y-4 mt-4 mx-4"
                onSubmit={(e) => {
                    e.preventDefault()
                    handleSaveUser()
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
                            Role
                        </FieldLabel>
                        <Select
                            value={role}
                            onValueChange={(value) => setRole(value)}
                            >
                            <SelectTrigger className="w-full max-w-48">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {availableRoles.map((r) => (
                                        <SelectItem key={r} value={r}>{r}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
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
