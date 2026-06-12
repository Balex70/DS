import { Order } from "./order"

export type PaymentStatus =
    | "draft"
    | "pending"
    | "paid"
    | "failed"
    | "refunded"
    | "canceled"

export type PaymentMethods =
    | "stripe"
    | "wayforpay"
    | "liqpay"

export type Payment = {
    id: number
    order_id: number
    order: Order
    transaction_id?: string
    gateway_payment_id?: string
    gateway: PaymentMethods
    amount: number
    currency: string
    status: PaymentStatus
    created_at: string
    updated_at: string
}

export type PaymentResponse = {
    redirect_url?: string;
    transaction_id?: string;
    payload?: Record<string, unknown>;
}

export type AvailableGatewayResponse = {
    gateway: string;
    methods: string[];
};

export type Meta = {
  total: number,
  per_page: number,
  current_page: number,
  last_page: number,
  from: number,
  to: number
}
