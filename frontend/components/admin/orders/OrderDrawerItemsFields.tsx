"use client"

import {
    TableCell,
    TableRow,
} from "@/components/ui/table"

import { FieldGroup } from "@/components/ui/field"
import { PriceRenderer } from "@/components/custom/PriceRenderer"
import { Order } from "@/types/order"
import ListOrderItems from "../orderItems/ListOrderItems"

export function OrderDrawerItemsFields({ order }: { order: Order }) {
    const itemsTotal = order.items?.reduce(
        (sum, item) => sum + item.total,
        0
    ) ?? 0

    return (
        <FieldGroup>
            <div className="rounded-md border">
                <ListOrderItems items={order.items || []} />
                <TableRow>
                    <TableCell colSpan={4} className="text-right font-semibold">
                        Total
                    </TableCell>

                    <TableCell className="text-right font-bold">
                        <PriceRenderer value={itemsTotal} />
                    </TableCell>
                </TableRow>
            </div>
        </FieldGroup>
    )
}
