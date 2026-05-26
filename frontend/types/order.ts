interface OrderPayloadInterface {
    shipping_full_name: string;
    shipping_phone?: string;
    shipping_email?: string;

    shipping_address_line1: string;
    shipping_address_line2?: string;

    shipping_city: string;
    shipping_state?: string;
    shipping_postal_code?: string;
    shipping_country: string;

    notes?: string;

    payment_method?: string;
    shipping_cost?: number;
    currency?: string;
};

export type OrderPayload = OrderPayloadInterface
