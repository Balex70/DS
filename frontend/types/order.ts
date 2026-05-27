interface OrderInterface {
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
    notes?: string;
    created_at: string;
    updated_at: string;
}

interface MetaInterface {
  total: number,
  per_page: number,
  current_page: number,
  last_page: number,
  from: number,
  to: number
}

interface OrderItem {
    order_id: number;
    product_id?: number;
    title: string;
    quantity: number;
    price: number;
    total: number;
    variant_data?: string;
}

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

export type Order = OrderInterface
export type Meta = MetaInterface
export type OrderPayload = OrderPayloadInterface
