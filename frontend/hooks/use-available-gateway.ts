import { useQuery } from "@tanstack/react-query";
import { getAvailableGateway } from "@/services/payment-service";

export function useAvailableGateway(
    country?: string,
    currency?: string
) {
    return useQuery({
        queryKey: ["available-gateway", country, currency],
        queryFn: () =>
            getAvailableGateway({
                country: country!,
                currency: currency!,
            }),
        enabled: !!country && !!currency,
    });
}
