import { SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminThemeProvider } from "@/components/admin/admin-theme-provider"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminBreadcrumbs } from "@/components/admin/admin-breadcrumbs"
import { getErrorStringFromCatch } from "@/helpers/general"
import { CommonLogger } from "@/lib/logger/commonLogger"
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  try {
    const cookieHeader = cookieStore
      .getAll()
      .map(c => `${c.name}=${c.value}`)
      .join('; ')

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cookie': cookieHeader
    };

    const user = await fetch(`${process.env.CORE_API_ENTRYPOINT}/users/me`, {
        method: 'GET',
        credentials: 'include',
        headers: headers,
        cache: 'no-cache', // 'no-cache' if you want it fresh each time
    })

    if (!user.ok) {
      redirect('/admin/login'); // forced login if customer not found
    }
  } catch (error) {
    const message = 'RootLayout: '  + getErrorStringFromCatch(error)
    CommonLogger('info', message, 'pino')
    redirect('/admin/login')
  }
  
  return (
    <AdminThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <AdminSidebar />
        <main  className="w-full">

          {/* Content */}
          <div className="flex-1 flex flex-col h-screen">

            {/* Sticky Header */}
            <AdminHeader />

            {/* Breadcrumbs */}
            <AdminBreadcrumbs />

            {/* Scrollable Content */}
            <main className="flex-1 overflow-auto p-4">
              {children}
            </main>

          </div>
        </main>
      </SidebarProvider>
    </AdminThemeProvider>
  )
}
