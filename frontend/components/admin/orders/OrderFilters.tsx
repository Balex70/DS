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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
    value: OrderStatus
    label: string
}[] = [
    { value: "pending", label: "Pending" },
    { value: "paid", label: "Paid" },
    { value: "processing", label: "Processing" },
    { value: "fulfilled", label: "Fulfilled" },
    { value: "canceled", label: "Canceled" },
    { value: "refunded", label: "Refunded" },
]

const PAYMENT_STATUSES: {
    value: PaymentStatus
    label: string
}[] = [
    { value: "unpaid", label: "Unpaid" },
    { value: "paid", label: "Paid" },
    { value: "failed", label: "Failed" },
    { value: "refunded", label: "Refunded" },
]

const DS_STATUSES: {
    value: string
    label: string
}[] = [
    { value: "pending", label: "Pending" },
    { value: "paid", label: "Paid" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
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
                            <Field>
                                <Label>Order Status</Label>

                                <Select
                                    value={status ?? ""}
                                    onValueChange={(value) =>
                                        onStatusChange(
                                            value
                                                ? (value as OrderStatus)
                                                : null
                                        )
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="All statuses" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {ORDER_STATUSES.map((status) => (
                                            <SelectItem
                                                key={status.value}
                                                value={status.value}
                                            >
                                                {status.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>

                            {/* PAYMENT STATUS */}
                            <Field>
                                <Label>Payment Status</Label>

                                <Select
                                    value={paymentStatus ?? ""}
                                    onValueChange={(value) =>
                                        onPaymentStatusChange(
                                            value
                                                ? (value as PaymentStatus)
                                                : null
                                        )
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="All payment statuses" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {PAYMENT_STATUSES.map((paymentStatus) => (
                                            <SelectItem
                                                key={paymentStatus.value}
                                                value={paymentStatus.value}
                                            >
                                                {paymentStatus.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>

                            {/* DS STATUS */}
                            <Field>
                                <Label>DS Status</Label>

                                <Select
                                    value={dsStatus ?? ""}
                                    onValueChange={(value) =>
                                        onDsStatusChange(
                                            value
                                                ? (value as DsStatus)
                                                : null
                                        )
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="All ds statuses" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {DS_STATUSES.map((dsStatus) => (
                                            <SelectItem
                                                key={dsStatus.value}
                                                value={dsStatus.value}
                                            >
                                                {dsStatus.label}
                                            </SelectItem>
                                        ))}
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
