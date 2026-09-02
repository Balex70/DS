"use client"
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
} from "@/components/ui/sidebar"
import { Hammer, Home, List, Settings, ShoppingCart, StretchHorizontal, UserLock, UsersRound, WalletCards } from "lucide-react"
import { AdminModeToggle } from "./admin-mode-toggle"
import Link from "next/link"

export function AdminSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu className="list-none m-0 p-0">
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/admin" className="flex items-center gap-2">
                <Home />
                <span>Admin</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex items-center justify-between">
          <AdminModeToggle />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Operational</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="list-none m-0 p-0">
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/orders" className="flex items-center gap-2">
                    <ShoppingCart />
                    <span>Orders</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/payments" className="flex items-center gap-2">
                    <WalletCards />
                    <span>Payments</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/customers" className="flex items-center gap-2">
                    <UsersRound />
                    <span>Customers</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Inventory</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="list-none m-0 p-0">
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/categories" className="flex items-center gap-2">
                    <StretchHorizontal />
                    <span>Categories</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/products" className="flex items-center gap-2">
                    <List />
                    <span>Products</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/materials" className="flex items-center gap-2">
                    <Hammer />
                    <span>Materials</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Area</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="list-none m-0 p-0">
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/users" className="flex items-center gap-2">
                    <UserLock />
                    <span>Users</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/settings" className="flex items-center gap-2">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {/* Footer */}
      </SidebarFooter>
      {/* <SidebarRail /> */}
    </Sidebar>
  )
}
