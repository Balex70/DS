'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { getCookie } from '@/helpers/general'

export function AdminLoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/sanctum/csrf-cookie`, {
        credentials: 'include',
      });
      
      const csrfToken = getCookie('XSRF-TOKEN');
      const headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-XSRF-TOKEN': csrfToken!, // get the csrf token
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/users/login`, {
          method: 'POST',
          credentials: 'include',
          headers: headers,
          body: JSON.stringify({
            email,
            password,
          }),
          cache: 'no-cache', // 'no-cache' if you want it fresh each time
      })
      
      if (!res.ok) {
        const data = await res.json()

        setError(data.message || 'Login failed')
        return
      }

      // Redirect after success
      router.push('/admin')

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </Button>

                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="#">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
