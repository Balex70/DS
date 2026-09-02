"use client"

import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { usePathname } from 'next/navigation'

type BreadcrumbItemType = {
  label: string
  href?: string
}

export function AdminBreadcrumbs() {
  const pathname = usePathname();

  if (!pathname) return null

  const items = pathname.split("/").filter(Boolean)

  const breadcrumbs: BreadcrumbItemType[] = items.map((item, index) => {
    const href = "/" + items.slice(0, index + 1).join("/")
    const label = item.charAt(0).toUpperCase() + item.slice(1);

    return {href, label}
  })

  return (
    <div className="flex items-center gap-4 px-4 py-2">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((item, index) => {
            const isLast = index === items.length - 1

            return (
              <div key={index} className="flex items-center">
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={item.href || "#"}>
                        {item.label}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>

                {!isLast && <BreadcrumbSeparator />}
              </div>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
