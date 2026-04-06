import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Home, User2, WalletCards } from "lucide-react"
import { AdminModeToggle } from "../ui/admin-mode-toggle"

export function AdminSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <h1>Admin</h1>
        <AdminModeToggle />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenuItem className="list-none">
              <SidebarMenuButton asChild>
                <a href="/home">
                  <Home />
                  <span>Home</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>            
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenuItem className="list-none">
              <SidebarMenuButton asChild>
                <a href="/payments">
                  <WalletCards />
                  <span>Payments</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>            
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
        <SidebarMenuItem>
            <SidebarMenuButton>
            <User2 /> Username
            </SidebarMenuButton>
        </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      {/* <SidebarRail /> */}
    </Sidebar>
  )
}
