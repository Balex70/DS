"use client";

import { AvailableGatewayResponse } from "@/types/payment";
import { ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

function PaymentSkeleton() {
    const t = useTranslations('frontend')
    return (
        <div className="space-y-3 animate-pulse">
            <p className="text-sm text-muted-foreground">
                {t('checkout.payment_info.skeleton_title')}
            </p>
            <div className="h-3 w-64 bg-gray-200 rounded" />

            <div className="space-y-2 mt-4">
                <div className="h-4 w-64 bg-gray-200 rounded" />
            </div>
        </div>
    );
}

export function PaymentInfo({ gateway, isLoading, }: {gateway: AvailableGatewayResponse, isLoading: boolean}) {
    const t = useTranslations('frontend')
    const paymentMethods: Record<
        string,
        {
            label: string;
            icon: React.ReactNode;
            width?: number;
            height?: number;
        }
    > = {
        card: {
            label: "Visa / Mastercard",
            icon: "/payments/methods/visa_mastercard.svg",
            width: 40,
            height: 40,
        },
        apple_pay: {
            label: "Apple Pay",
            icon: "/payments/methods/apple_pay.svg",
        },
        google_pay: {
            label: "Google Pay",
            icon: "/payments/methods/google_pay.svg",
        },
        privat24: {
            label: "Privat24",
            icon: "/payments/methods/privat24.svg",
            width: 100,
            height: 100,
        },
    };

    return (
        <div className="space-y-2">
            <h2 className="font-semibold">
                {t('checkout.payment_info.header')}
            </h2>

            <div className="rounded-lg border p-4">
                {isLoading || !gateway ? (
                    <PaymentSkeleton />
                ) : (
                    <>
                        <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                            <ShieldCheck className="h-4 w-4 text-green-600" />
                            <span>
                                {t('checkout.payment_info.gateway_title')} {gateway.gateway}
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {gateway.methods.map((method) => {
                                const payment = paymentMethods[method];

                                if (!payment) return null;

                                return (
                                <span
                                    key={method}
                                    className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs"
                                    title={payment.label}
                                >
                                    {payment && (
                                        <Image
                                            src={payment.icon as string}
                                            alt={payment.label}
                                            width={payment.width || 60}
                                            height={payment.height || 60}
                                            className="object-contain"
                                        />
                                    )}
                                </span>
                                )
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
