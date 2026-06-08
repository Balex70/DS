'use client'

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Field, FieldGroup } from "@/components/ui/field"
import { BadgeX } from "lucide-react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    status: string | null
    gateway: string | null
    onStatusChange: (value: string | null) => void
    onGatewayChange: (value: string | null) => void
}

export function PaymentFilters({
    open,
    onOpenChange,
    status,
    gateway,
    onStatusChange,
    onGatewayChange,
}: Props) {
    type FilterBadge = {
        label: string
        onClick: () => void
        color: string
    }
    const activeFilters: { label: string; onClick: () => void; color: string }[] = [
        status && {
            label: "Status: " + status,
            onClick: () => onStatusChange(null),
            color: "blue",
        },
        gateway && {
            label: "Gateway: " + gateway,
            onClick: () => onGatewayChange(null),
            color: "green",
        },
    ].filter((f): f is FilterBadge => f !== null)
    return (
        <div className="w-full mb-4">
        <Collapsible open={open} onOpenChange={onOpenChange}>
            <CollapsibleTrigger asChild>
            <Button variant="outline" size="default">
                Filters
            </Button>
            
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
            <Card className="w-full">
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* LEFT COLUMN */}
                        <FieldGroup className="space-y-2">
                            <Field orientation="horizontal">
                                <Label>Status</Label>
                                <Select value={status ||  '__all__'} onValueChange={(value) => onStatusChange(value === "__all__" ? null : value)}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Payment Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="__all__">All</SelectItem>
                                            <SelectItem value="draft">draft</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="paid">Paid</SelectItem>
                                            <SelectItem value="failed">Failed</SelectItem>
                                            <SelectItem value="refunded">Refunded</SelectItem>
                                            <SelectItem value="canceled">Canceled</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Field>
                        </FieldGroup>

                        {/* RIGHT COLUMN */}
                        <FieldGroup className="space-y-1">
                            <Field orientation="horizontal">
                                <Label>Gateway</Label>
                                <Select
                                    value={gateway || '__all__'}
                                    onValueChange={(value) => onGatewayChange(value === "__all__" ? null : value)}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Payment Gateway" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="__all__">All</SelectItem>
                                            <SelectItem value="stripe">Stripe</SelectItem>
                                            <SelectItem value="wayforpay">Wayforpay</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Field>
                        </FieldGroup>

                    </div>
                </CardContent>
            </Card>
            </CollapsibleContent>
            {activeFilters.length > 0 && (
                <div className="flex w-full flex-wrap justify-center gap-2 mt-3">
                {activeFilters.map((filter, index) => (
                    <Badge key={index} variant="default" onClick={filter.onClick}>
                        {filter.label}
                        <BadgeX data-icon="inline-start" />
                    </Badge>
                ))}
                </div>
            )}
        </Collapsible>
        </div>
    )
}
