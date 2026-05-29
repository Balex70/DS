import { useQuery } from "@tanstack/react-query";
import { getShippingCalculate } from "@/services/order-service";

type ShippingCalculatePayload = {
    shipping_country: string;
    shipping_postal_code?: string;
};

export function useShippingCalculate(
    payload: ShippingCalculatePayload | null
) {
    return useQuery({
        queryKey: ["shipping-calculate", payload],
        queryFn: () => {
            if (!payload) throw new Error("Missing shipping payload");
            return getShippingCalculate(payload);
        },
        enabled: !!payload?.shipping_country, // only run when ready
    });
}
