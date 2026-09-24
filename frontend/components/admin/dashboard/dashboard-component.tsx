'use client'

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Hammer,
  DollarSign,
  FolderTree,
  List,
  Settings,
  ShoppingCart,
  Users,
  UserLock,
  ClipboardClock,
} from "lucide-react"

const sections = [
  {
    title: "Operational",
    links: [
      {
        label: "Orders",
        description: "Manage customer orders",
        href: "/admin/orders",
        icon: ShoppingCart,
        iconClassName: "bg-green-100 text-green-600",
      },
      {
        label: "Payments",
        description: "View payment transactions",
        href: "/admin/payments",
        icon: DollarSign,
        iconClassName: "bg-green-100 text-green-600",
      },
      {
        label: "Customers",
        description: "Manage your customers",
        href: "/admin/customers",
        icon: Users,
        iconClassName: "bg-green-100 text-green-600",
      },
    ],
  },
  {
    title: "Inventory",
    links: [
      {
        label: "Categories",
        description: "Manage product categories",
        href: "/admin/categories",
        icon: FolderTree,
        iconClassName: "bg-cyan-100 text-cyan-600",
      },
      {
        label: "Products",
        description: "Manage your products",
        href: "/admin/products",
        icon: List,
        iconClassName: "bg-cyan-100 text-cyan-600",
      },
      {
        label: "Materials",
        description: "Manage product materials",
        href: "/admin/materials",
        icon: Hammer,
        iconClassName: "bg-cyan-100 text-cyan-600",
      },
    ],
  },
  {
    title: "Admin Area",
    links: [
      {
        label: "Users",
        description: "Manage admin users",
        href: "/admin/users",
        icon: UserLock,
        iconClassName: "bg-slate-100 text-slate-600",
      },
      {
        label: "Settings",
        description: "Configure the store",
        href: "/admin/settings",
        icon: Settings,
        iconClassName: "bg-slate-100 text-slate-600",
      },
      {
        label: "Logs",
        description: "View application logs",
        href: "/admin/logs",
        icon: ClipboardClock,
        iconClassName: "bg-slate-100 text-slate-600",
      },
    ],
  },
]

function DashboardComponent () {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your store and administration.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {sections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>

            <CardContent className="grid gap-2">
              {section.links.map((link) => {
                const Icon = link.icon

                return (
                  <Link key={link.href} href={link.href}>
                    <Card className="h-full transition-colors hover:bg-muted/50">
                      <CardContent className="flex items-center gap-2 px-6 py-2">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${link.iconClassName}`}>
                          <Icon className="h-6 w-6" />
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-semibold">
                            {link.label}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {link.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default DashboardComponent
