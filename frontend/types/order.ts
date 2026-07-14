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
    shipping_phone?: string;
    shipping_email?: string;
    shipping_address_line1: string;
    shipping_address_line2?: string;
    shipping_city: string;
    shipping_state?: string;
    shipping_postal_code?: string;
    shipping_country: string;
    public_token: string;
    notes?: string;
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
    shipping_phone: string;
    shipping_email: string;

    shipping_address_line1: string;
    shipping_address_line2: string;

    shipping_city: string;
    shipping_state: string;
    shipping_postal_code: string;
    shipping_country: string;

    notes: string;

    payment_method?: string;
    shipping_cost?: number;
    shipping_method?: string;
    currency?: string;
};

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
