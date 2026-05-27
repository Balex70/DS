"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { FieldGroup } from "@/components/ui/field"
import { PriceRenderer } from "@/components/custom/PriceRenderer"
import { Order } from "@/types/order"

export function OrderDrawerItemsFields({ order }: { order: Order }) {
    const itemsTotal = order.items?.reduce(
        (sum, item) => sum + item.total,
        0
    ) ?? 0

    return (
        <FieldGroup>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Variant</TableHead>
                            <TableHead className="w-[100px] text-center">
                                Qty
                            </TableHead>
                            <TableHead className="text-right">
                                Price
                            </TableHead>
                            <TableHead className="text-right">
                                Total
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {order.items?.length ? (
                            order.items.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">
                                        {item.title}
                                    </TableCell>

                                    <TableCell className="text-muted-foreground">
                                        {item.variant_data || "-"}
                                    </TableCell>

                                    <TableCell className="text-center">
                                        {item.quantity}
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <PriceRenderer value={item.price} />
                                    </TableCell>

                                    <TableCell className="text-right font-medium">
                                        <PriceRenderer value={item.total} />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    No items found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>

                    {!!order.items?.length && (
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={4} className="text-right font-semibold">
                                    Total
                                </TableCell>

                                <TableCell className="text-right font-bold">
                                    <PriceRenderer value={itemsTotal} />
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    )}
                </Table>
            </div>
        </FieldGroup>
    )
}
