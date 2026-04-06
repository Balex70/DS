import { SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminThemeProvider } from "@/components/admin/admin-theme-provider"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminBreadcrumbs } from "@/components/admin/admin-breadcrumbs"

export default function Layout({ children }: { children: React.ReactNode }) {
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
