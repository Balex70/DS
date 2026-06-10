"use client";

import { Button } from "@/components/ui/button";
import { useOrderByPublicToken } from "@/hooks/use-order-by-public-token";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function CheckoutPaymentResultComponent({ token }: { token: string | undefined }) {
    const { data: order, isLoading } = useOrderByPublicToken(token);
    return (
        <div className="container mx-auto max-w-2xl px-4 py-16">
            <div className="rounded-lg border bg-card p-8 text-center shadow-sm">
                <CheckCircle2 className="mx-auto mb-6 h-16 w-16 text-green-600" />

                <h1 className="mb-4 text-3xl font-bold">
                    Thank you for your order!
                </h1>

                <p className="mb-4 text-muted-foreground">
                    We have received your payment attempt and are currently
                    processing it.
                </p>

                <p className="mb-8 text-muted-foreground">
                    Your order status will be updated automatically once the
                    payment provider confirms the transaction.
                </p>

                {!isLoading && order && (
                    <div className="rounded-md bg-muted px-4 py-3 text-sm">
                        Order number:{" "}
                        <span className="font-semibold">
                            #{order.order_number}
                        </span>
                    </div>
                )}
                
                <Button asChild className="mt-3">
                    <Link href="/">
                        Continue shopping
                    </Link>
                </Button>
                
                {/* <Button variant="outline" asChild className="ml-3 mt-3">
                    <Link href="/account/orders">
                        View my orders
                    </Link>
                </Button> */}
            </div>
        </div>
    );
}
