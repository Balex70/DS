import { useQuery } from "@tanstack/react-query";
import { getShippingCalculate } from "@/services/order-service";
import { CurrencyCode } from "@/types/currency";

type ShippingCalculatePayload = {
    shipping_country: string;
    shipping_postal_code?: string;
};

export function useShippingCalculate(
    payload: ShippingCalculatePayload | null,
    cartKey: string | undefined,
    currency?: CurrencyCode
) {
    return useQuery({
        queryKey: ["shipping-calculate", payload, cartKey, currency],
        queryFn: () => {
            if (!payload) throw new Error("Missing shipping payload");
            return getShippingCalculate(payload, currency);
        },
        enabled: !!payload?.shipping_country, // only run when ready
    });
}
