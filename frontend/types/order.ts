export type Order = {
    id: number;
    order_number: string;
    customer_id?: number;
    items: OrderItem[];
    ds_provider: string;
    ds_order_id?: string;
    ds_tracking_number?: string;
    ds_status?: string;
    subtotal: number;
    shipping_cost: number;
    shipping_method: string;
    total: number;
    currency: string;
    status: string;
    payment_method: string;
    payment_status: string;
    shipping_full_name: string;
    shipping_full_name_latin?: string;
    shipping_phone?: string;
    shipping_email?: string;
    shipping_address_line1: string;
    shipping_address_line1_latin?: string;
    shipping_address_line2?: string;
    shipping_address_line2_latin?: string;
    shipping_city: string;
    shipping_city_latin?: string;
    shipping_state?: string;
    shipping_state_latin?: string;
    shipping_postal_code?: string;
    shipping_country: string;
    public_token: string;
    notes?: string;
    locale: string;
    created_at: string;
    updated_at: string;
}

export type Meta = {
  total: number,
  per_page: number,
  current_page: number,
  last_page: number,
  from: number,
  to: number
}

type OrderItem = {
    order_id: number;
    product_id?: number;
    title: string;
    quantity: number;
    price: number;
    total: number;
    variant_data?: string;
}

export type OrderPayload = {
    shipping_full_name: string;
    shipping_full_name_latin?: string;
    shipping_phone: string;
    shipping_email: string;

    shipping_address_line1: string;
    shipping_address_line1_latin?: string;
    shipping_address_line2: string;
    shipping_address_line2_latin?: string;

    shipping_city: string;
    shipping_city_latin?: string;
    shipping_state: string;
    shipping_state_latin?: string;
    shipping_postal_code: string;
    shipping_country: string;

    notes: string;

    payment_method?: string;
    shipping_cost?: number;
    shipping_method?: string;
    currency?: string;
    locale?: string;
};

export type TrackingInfo = {
    trackingNumber: string
    logisticName: string
    trackingFrom: string
    trackingTo: string
    deliveryDay: string
    deliveryTime: string
    trackingStatus: string
    lastMileCarrier: string
    lastTrackNumber: string
}

export const latinFieldsMapper = {
    shipping_full_name: "shipping_full_name_latin",
    shipping_address_line1: "shipping_address_line1_latin",
    shipping_address_line2: "shipping_address_line2_latin",
    shipping_city: "shipping_city_latin",
    shipping_state: "shipping_state_latin",
} as const;

export type LatinFieldType = (typeof latinFieldsMapper)[keyof typeof latinFieldsMapper];

export type OrderStatus =
    | "draft"
    | "created"
    | "processing"
    | "shipped"
    | "delivered"
    | "canceled"
    | "refunded"

export type DsStatus =
    | "created"
    | "unpaid"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "failed"

export type CheckoutStatus =
    | "idle"
    | "creating-order"
    | "creating-payment"
    | "redirecting"
    | "failed"
