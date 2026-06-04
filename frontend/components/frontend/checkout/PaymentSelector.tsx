"use client";

import { ShippingMethod } from "@/types/shipping";
import { PaymentMethods } from "@/types/payment";

type Props = {
    shippingMethod?: ShippingMethod,
    paymentMethod: PaymentMethods,
    setPaymentMethod: (PaymentMethod: PaymentMethods) => void;
};

export function PaymentSelector({
    shippingMethod,
    paymentMethod,
    setPaymentMethod,
}: Props) {
    if (shippingMethod === undefined) {
        return;
    }
    return (
        <div className="space-y-2">
            <h2 className="font-semibold">Available Payment methods</h2>

            <label className="flex items-center gap-2">
                <input
                    type="radio"
                    checked={paymentMethod === "stripe"}
                    onChange={() => setPaymentMethod("stripe")}
                />
                Stripe (Card / Google Pay / Apple Pay)
            </label>

            <label className="flex items-center gap-2">
                <input
                    type="radio"
                    checked={paymentMethod === "wayforpay"}
                    onChange={() => setPaymentMethod("wayforpay")}
                />
                WayForPay (Card / Google Pay / Apple Pay)
            </label>
        </div>
    );
}
