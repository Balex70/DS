"use client";

import { Button } from "@/components/ui/button";
import { useOrderByPublicToken } from "@/hooks/use-order-by-public-token";
import { CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function CheckoutPaymentResultComponent({ token }: { token: string | undefined }) {
    const { data: order, isLoading } = useOrderByPublicToken(token);
    const t = useTranslations('frontend')
    return (
        <div className="container mx-auto max-w-2xl px-0 sm:px-4 py-2 sm:py-14">
            <div className="rounded-lg border bg-card p-4 sm:p-6 text-center shadow-sm">
                <CheckCircle2 className="mx-auto mb-4 sm:mb-6 h-12 sm:h-16 w-12 sm:w-16 text-green-600" />

                <h1 className="mb-4 text-xl sm:text-3xl font-bold">
                    {t('checkout.payment_result.header')}
                </h1>

                <p className="mb-4 text-muted-foreground">
                    {t('checkout.payment_result.text_1')}
                </p>

                <p className="mb-8 text-muted-foreground">
                    {t('checkout.payment_result.text_2')}
                </p>

                {!isLoading && order && (
                    <div className="rounded-md bg-muted px-4 py-3 text-sm">
                        {t('checkout.payment_result.order_number')}:{" "}
                        <span className="font-semibold">
                            #{order.order_number}
                        </span>
                    </div>
                )}
                
                <Button asChild className="mt-3">
                    <Link href="/">
                        {t('checkout.payment_result.continue_button')}
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
