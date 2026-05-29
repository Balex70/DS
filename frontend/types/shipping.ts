export type ShippingMethod = {
    id: string;
    name: string;
    price: number;
    estimated_delivery: string;
    total_price?: number;
    taxes_fee?: number;
    provider?: "cj";
};
