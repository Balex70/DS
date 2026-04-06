import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminThemeProvider } from "@/components/ui/admin-theme-provider"

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
        <main>
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </AdminThemeProvider>
  )
}
