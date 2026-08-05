"use client"

import { Order } from "@/types/order"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

export function CancelOrderButton({
    order,
    handler,
    isCheck
}: {
    order: Order | null
    handler: () => void
    isCheck: boolean
}) {

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">
                    Cancel order
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Cancel this order?
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        This will cancel order <strong>#{order?.order_number}</strong>.
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Keep order
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={handler}
                        disabled={isCheck}
                    >
                        {isCheck && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {isCheck ? "Cancelling..." : "Yes, cancel order"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
