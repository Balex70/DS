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
import { DsStatus, OrderStatus } from "@/types/order"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PaymentStatus } from "@/types/payment"

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    status: OrderStatus | null
    paymentStatus: PaymentStatus | null
    dsStatus: string | null
    onStatusChange: (value: OrderStatus | null) => void
    onPaymentStatusChange: (value: PaymentStatus | null) => void
    onDsStatusChange: (value: DsStatus | null) => void
}

const ORDER_STATUSES: {
    value: OrderStatus | "__all__"
    label: string
}[] = [
    { value: "__all__", label: "All" },
    { value: "draft", label: "Draft" },
    { value: "created", label: "Created" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "shipped" },
    { value: "delivered", label: "delivered" },
    { value: "canceled", label: "Canceled" },
    { value: "refunded", label: "Refunded" },
]

const PAYMENT_STATUSES: {
    value: PaymentStatus | "__all__"
    label: string
}[] = [
    { value: "__all__", label: "All" },
    { value: "draft", label: "Draft" },
    { value: "pending", label: "Pending" },
    { value: "paid", label: "Paid" },
    { value: "failed", label: "Failed" },
    { value: "refunded", label: "Refunded" },
    { value: "canceled", label: "Canceled" },
]

const DS_STATUSES: {
    value: DsStatus | "__all__"
    label: string
}[] = [
    { value: "__all__", label: "All" },
    { value: "created", label: "Created" },
    { value: "unpaid", label: "Unpaid" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
    { value: "failed", label: "Failed" },
]

export function OrderFilters({
    open,
    onOpenChange,
    status,
    paymentStatus,
    dsStatus,
    onStatusChange,
    onPaymentStatusChange,
    onDsStatusChange,
}: Props) {
    type FilterBadge = {
        label: string
        onClick: () => void
        color: string
    }
    const activeFilters: { label: string; onClick: () => void; color: string }[] = [
        status && {
            label: 'Order Status: ' + 
                (ORDER_STATUSES.find((s) => s.value === status)?.label ?? status),
            onClick: () => onStatusChange(null),
        },
        paymentStatus && {
            label: 'Payment Status: ' + 
                (PAYMENT_STATUSES.find((s) => s.value === paymentStatus)?.label ?? paymentStatus),
            onClick: () => onPaymentStatusChange(null),
        },
        dsStatus && {
            label: 'DS Status: ' + 
                (DS_STATUSES.find((s) => s.value === dsStatus)?.label ?? dsStatus),
            onClick: () => onDsStatusChange(null),
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
                        <FieldGroup className="space-y-3">
                            {/* STATUS */}
                            <Field orientation="horizontal">
                                <Label>Order Status</Label>
                                <Select value={status ||  '__all__'} onValueChange={(value: OrderStatus | "__all__") => onStatusChange(value === "__all__" ? null : value)}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Order Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {ORDER_STATUSES.map((status) => (
                                                <SelectItem
                                                    key={status.value}
                                                    value={status.value}
                                                >
                                                    {status.label}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Field>

                            {/* PAYMENT STATUS */}
                            <Field orientation="horizontal">
                                <Label>Payment Status</Label>
                                <Select value={paymentStatus ||  '__all__'} onValueChange={(value: PaymentStatus | "__all__") => onPaymentStatusChange(value === "__all__" ? null : value)}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Payment Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {PAYMENT_STATUSES.map((paymentStatus) => (
                                                <SelectItem
                                                    key={paymentStatus.value}
                                                    value={paymentStatus.value}
                                                >
                                                    {paymentStatus.label}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Field>

                            {/* DS STATUS */}
                            <Field orientation="horizontal">
                                <Label>DS Status</Label>
                                <Select value={dsStatus ||  '__all__'} onValueChange={(value: DsStatus | "__all__") => onDsStatusChange(value === "__all__" ? null : value)}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="DS Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {DS_STATUSES.map((dsStatus) => (
                                                <SelectItem
                                                    key={dsStatus.value}
                                                    value={dsStatus.value}
                                                >
                                                    {dsStatus.label}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Field>
                        </FieldGroup>

                        {/* RIGHT COLUMN */}
                        <div className="space-y-2">
                            <Label>Other filters</Label>

                        </div>

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
