"use client";

import { AvailableGatewayResponse } from "@/types/payment";

function PaymentSkeleton() {
    return (
        <div className="space-y-3 animate-pulse">
            <p className="text-sm text-muted-foreground">
                Enter country to see payments options
            </p>
            <div className="h-4 w-48 bg-gray-200 rounded" />
            <div className="h-3 w-64 bg-gray-200 rounded" />

            <div className="space-y-2 mt-4">
                <div className="h-3 w-40 bg-gray-200 rounded" />
                <div className="h-3 w-40 bg-gray-200 rounded" />
                <div className="h-3 w-40 bg-gray-200 rounded" />
            </div>
        </div>
    );
}

export function PaymentInfo({ gateway, isLoading, }: {gateway: AvailableGatewayResponse, isLoading: boolean}) {
    const labels: Record<string, string> = {
        card: "Visa / Mastercard",
        apple_pay: "Apple Pay",
        google_pay: "Google Pay",
        link: "Link",
    };

    return (
        <div className="space-y-2">
            <h2 className="font-semibold">
                Payment Methods
            </h2>

            <div className="rounded-lg border p-4">
                {isLoading || !gateway ? (
                    <PaymentSkeleton />
                ) : (
                    <>
                        <div className="mb-2 text-sm text-muted-foreground">
                            Secure payment powered by {gateway.gateway}
                        </div>

                        <ul className="space-y-1">
                            {gateway.methods.map((method) => (
                                <li key={method}>
                                    ✓ {labels[method] ?? method}
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
}
