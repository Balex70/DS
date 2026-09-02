"use client"

import { AdminUserDropdown } from "@/components/admin/admin-user-dropdown"
import { SidebarTrigger } from "../ui/sidebar"

export function AdminHeader() {
  
  return (
    <header className="sticky top-0 z-10 bg-background border-b">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          Header content
        </div>
        <div className="flex items-center gap-4">
          {/* You can add Search or Notifications here too */}
          <AdminUserDropdown />
        </div>
      </div>
    </header>
  )
}
