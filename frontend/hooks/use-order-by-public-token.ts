import { useQuery } from "@tanstack/react-query";
import { getOrderByPublicToken } from "@/services/order-service";
import { Order } from "@/types/order";

export function useOrderByPublicToken(token?: string) {
    return useQuery<Order>({
        queryKey: ["order", token],
        queryFn: () => {
            if (!token) {
                throw new Error("Token is required");
            }

            return getOrderByPublicToken(token);
        },
        enabled: !!token,
        retry: false,
    });
}
