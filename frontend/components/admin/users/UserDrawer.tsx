"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { User } from "./columns"
import { CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export function UserDrawer({
  open,
  onOpenChange,
  user,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  user: User | null
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>User details</SheetTitle>
        </SheetHeader>

        {user && (
            <CardContent className="space-y-4">
                <div>
                    <Label>Name</Label>
                    <div className="text-md text-muted-foreground">
                        {user.name}
                    </div>
                </div>

                <div>
                    <Label>Email</Label>
                    <div className="text-md text-muted-foreground">
                        {user.email}
                    </div>
                </div>

                <div>
                    <Label>Role</Label>
                    <div className="text-md text-muted-foreground">
                        {user.role}
                    </div>
                </div>
            </CardContent>
        )}
      </SheetContent>
    </Sheet>
  )
}
